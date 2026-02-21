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
