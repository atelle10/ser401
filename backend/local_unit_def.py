class UnitOriginHelper:
    SCOTTSDALE_PREFIXES = ["LT", "BC", "BR", "BE", "HM", "E", "L", "R", "S", "U", "T"]

    @staticmethod
    def is_scottsdale_unit(unit_resource_id: str) -> bool:
        for prefix in UnitOriginHelper.SCOTTSDALE_PREFIXES:
            if not unit_resource_id.startswith(prefix):
                continue
            remainder = unit_resource_id[len(prefix) :]
            if len(remainder) == 4 and remainder[0] == "6" and remainder.isdigit():
                return True
        return False

    @staticmethod
    def get_unit_origin_breakdown(df):
        units = {}
        for _, row in df.iterrows():
            unit_id = row.get("unit_id")
            if not unit_id or str(unit_id) == "None":
                continue
            unit_id = str(unit_id)
            if unit_id not in units:
                units[unit_id] = {
                    "unit_id": unit_id,
                    "is_scottsdale_unit": UnitOriginHelper.is_scottsdale_unit(unit_id),
                    "response_count": 0,
                }
            units[unit_id]["response_count"] += 1
        return sorted(units.values(), key=lambda u: u["response_count"], reverse=True)
