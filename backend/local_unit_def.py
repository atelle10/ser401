import logging
import math

logger = logging.getLogger(__name__)


class UnitOriginHelper:
    SCOTTSDALE_PREFIXES = ["LT", "BC", "BR", "BE", "HM", "E", "L", "R", "S", "U", "T"]

    @staticmethod
    def is_scottsdale_unit(unit_resource_id: str) -> bool:
        for prefix in UnitOriginHelper.SCOTTSDALE_PREFIXES:
            if not unit_resource_id.startswith(prefix):
                continue
            remainder = unit_resource_id[len(prefix) :]
            if len(remainder) in (3, 4) and remainder[0] == "6" and remainder.isdigit():
                return True
        return False

    @staticmethod
    def get_unit_origin_breakdown(df, db=None):
        if db:
            db_df = db.read_table("fire_ems.scottsdale_units")
            db_units = set(db_df["unit_id"].tolist()) if not db_df.empty else set()
        else:
            db_units = None

        units = {}
        for _, row in df.iterrows():
            unit_id = row.get("unit_id")
            if not unit_id or str(unit_id) == "None":
                continue
            unit_id = str(unit_id)
            if unit_id not in units:
                is_scottsdale = UnitOriginHelper.is_scottsdale_unit(unit_id)
                if db_units is not None:
                    in_db = unit_id in db_units
                    if is_scottsdale and not in_db:
                        logger.warning(f"Unit {unit_id}: classified as Scottsdale but missing from DB table")
                    elif not is_scottsdale and in_db:
                        logger.warning(f"Unit {unit_id}: in DB table but not classified as Scottsdale")
                units[unit_id] = {
                    "unit_id": unit_id,
                    "is_scottsdale_unit": is_scottsdale,
                    "response_count": 0,
                }
            units[unit_id]["response_count"] += 1
        return sorted(units.values(), key=lambda u: u["response_count"], reverse=True)

    @staticmethod
    def compute_mutual_aid(df, db=None):
        breakdown = UnitOriginHelper.get_unit_origin_breakdown(df, db)
        scottsdale_set = {u["unit_id"] for u in breakdown if u["is_scottsdale_unit"]}

        scottsdale_units_outside = 0
        other_units_in_scottsdale = 0

        for _, row in df.iterrows():
            unit_id = row.get("unit_id")
            postal_code = row.get("postal_code")
            if not unit_id or str(unit_id) == "None":
                continue
            unit_id = str(unit_id)

            try:
                p = int(str(postal_code).strip())
                in_scottsdale = 85250 <= p <= 85266
            except (ValueError, TypeError):
                in_scottsdale = False

            is_scottsdale = unit_id in scottsdale_set
            if is_scottsdale and not in_scottsdale:
                scottsdale_units_outside += 1
            elif not is_scottsdale and in_scottsdale:
                other_units_in_scottsdale += 1

        return {
            "scottsdale_units_outside": scottsdale_units_outside,
            "other_units_in_scottsdale": other_units_in_scottsdale,
        }

    @staticmethod
    def compute_uhu_by_origin(df, time_period_hours):
        scottsdale_hours = {}
        non_scottsdale_hours = {}

        for _, row in df.iterrows():
            unit_id = row.get("unit_id")
            dispatch = row.get("dispatch_time")
            clear = row.get("clear_time")
            if not unit_id or not dispatch or not clear:
                continue
            unit_id = str(unit_id)
            try:
                busy = (clear - dispatch).total_seconds() / 3600
            except Exception:
                continue
            if not math.isfinite(busy) or busy <= 0 or busy > 24:
                continue

            target = scottsdale_hours if UnitOriginHelper.is_scottsdale_unit(unit_id) else non_scottsdale_hours
            if unit_id not in target:
                target[unit_id] = 0
            target[unit_id] += busy

        def avg_uhu(unit_hours):
            if not unit_hours:
                return 0
            uhus = [(hours / time_period_hours) * 100 for hours in unit_hours.values()]
            return sum(uhus) / len(uhus)

        return {
            "scottsdale_uhu": round(avg_uhu(scottsdale_hours), 1),
            "non_scottsdale_uhu": round(avg_uhu(non_scottsdale_hours), 1),
        }
