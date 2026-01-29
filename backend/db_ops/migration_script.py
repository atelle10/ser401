import sys
import os
import pandas as pd
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://michael@localhost/famar_db")

INCIDENT_COLUMNS = {
    "Basic Incident Number (FD1)": "basic_incident_number",
    "Basic Incident City Name (FD1.16)": "basic_incident_city_name",
    "Basic Primary Station Name (FD1.4)": "basic_primary_station_name",
    "Basic Incident Type Code (FD1.21)": "basic_incident_type_code",
    "Basic Incident Type Code And Description (FD1.21)": "basic_incident_type_code_and_description",
    "Basic Secondary Station Names List (FD1.4.1)": "basic_secondary_station_names_list",
    "Basic Incident PSAP Date Time (FD1.51)": "basic_incident_psap_date_time",
    "Basic Shift Or Platoon (FD1.30)": "basic_shift_or_platoon",
    "Basic Incident Year (FD1.3)": "basic_incident_year",
    "Basic Incident Month (FD1.3)": "basic_incident_month",
    "Basic Incident Day Of Month (FD1.3)": "basic_incident_day_of_month",
    "Basic Incident Day Of Week (FD1.3)": "basic_incident_day_of_week",
    "Basic Incident Week (FD1.3)": "basic_incident_week",
    "Basic Incident Day Name (FD1.3)": "basic_incident_day_name",
    "Basic Incident Type (FD1.21)": "basic_incident_type",
    "Basic Incident Postal Code (FD1.19)": "basic_incident_postal_code",
    "Basic Arrival At Hospital Date Time (FD1.76)": "basic_arrival_at_hospital_date_time",
}

UNIT_RESPONSE_COLUMNS = {
    "Apparatus Resource ID (FD18.1)": "apparatus_resource_id",
    "Apparatus Resource Type Category (FD18.2)": "apparatus_resource_type_category",
    "Apparatus Resource Type Code (FD18.2)": "apparatus_resource_type_code",
    "Apparatus Resource Dispatch Date Time (FD18.3)": "apparatus_resource_dispatch_date_time",
    "Apparatus Resource En Route Date Time (FD18.10)": "apparatus_resource_en_route_date_time",
    "Apparatus Resource Arrival Date Time (FD18.4)": "apparatus_resource_arrival_date_time",
    "Apparatus Resource Arrival At Hospital Date Time (FD1.73)": "apparatus_resource_arrival_at_hospital_date_time",
    "Apparatus Resource Clear Date Time (FD18.5)": "apparatus_resource_clear_date_time",
    "Apparatus Resource In Quarters Date Time (FD1.74)": "apparatus_resource_in_quarters_date_time",
    "Apparatus Resource In Service Date Time (FD18.5.1)": "apparatus_resource_in_service_date_time",
    "Apparatus Resource Leave Scene Date Time (FD1.72)": "apparatus_resource_leave_scene_date_time",
}

EMS_RUN_COLUMNS = {
    "Response Incident Number (eResponse.03)": "response_incident_number",
    "Response EMS Response Number (eResponse.04)": "response_ems_response_number",
    "Response EMS Unit Call Sign (eResponse.14)": "response_ems_unit_call_sign",
    "Response EMS Vehicle Unit Number (eResponse.13)": "response_ems_vehicle_unit_number",
    "Response Level Of Care Of This Unit (3.4=eResponse.15/3.5=itResponse.115)": "response_level_of_care_of_this_unit",
    "Incident Unit Left Scene Date Time (eTimes.09)": "incident_unit_left_scene_date_time",
    "Incident Unit Left Scene Date Time With Not Values (eTimes.09)": "incident_unit_left_scene_date_time_with_not_values",
    "Incident Patient Arrived At Destination Date Time (eTimes.11)": "incident_patient_arrived_at_destination_date_time",
    "Incident Patient Arrived At Destination Date Time With Not Values (eTimes.11)": "incident_patient_arrived_at_destination_date_time_with_not_values",
    "Incident Dispatch Priority Patient Acuity (eDispatch.05)": "incident_dispatch_priority_patient_acuity",
    "Disposition Destination Name Delivered Transferred To (eDisposition.01)": "disposition_destination_name_delivered_transferred_to",
}

def main(fire_csv_path, ems_csv_path):
    engine = create_engine(DATABASE_URL)

    fire_df = pd.read_csv(fire_csv_path)
    ems_df = pd.read_csv(ems_csv_path)

    create_fire_raw_query = """
    DROP TABLE IF EXISTS fire_ems.fire_raw;
    CREATE TABLE fire_ems.fire_raw (
        id SERIAL PRIMARY KEY,
        "Basic Incident Number (FD1)" TEXT,
        "Basic Incident City Name (FD1.16)" TEXT,
        "Basic Primary Station Name (FD1.4)" TEXT,
        "Basic Incident Type Code (FD1.21)" TEXT,
        "Basic Incident Type Code And Description (FD1.21)" TEXT,
        "Basic Secondary Station Names List (FD1.4.1)" TEXT,
        "Basic Incident PSAP Date Time (FD1.51)" TEXT,
        "Basic Shift Or Platoon (FD1.30)" TEXT,
        "Apparatus Resource Dispatch Date Time (FD18.3)" TEXT,
        "Apparatus Resource En Route Date Time (FD18.10)" TEXT,
        "Apparatus Resource Arrival Date Time (FD18.4)" TEXT,
        "Apparatus Resource Arrival At Hospital Date Time (FD1.73)" TEXT,
        "Apparatus Resource Clear Date Time (FD18.5)" TEXT,
        "Apparatus Resource ID (FD18.1)" TEXT,
        "Basic Incident Year (FD1.3)" TEXT,
        "Basic Incident Month (FD1.3)" TEXT,
        "Basic Incident Day Of Month (FD1.3)" TEXT,
        "Basic Incident Day Of Week (FD1.3)" TEXT,
        "Basic Incident Week (FD1.3)" TEXT,
        "Basic Incident Day Name (FD1.3)" TEXT,
        "Basic Incident Type (FD1.21)" TEXT,
        "Apparatus Resource Type Category (FD18.2)" TEXT,
        "Apparatus Resource Type Code (FD18.2)" TEXT,
        "Basic Incident Postal Code (FD1.19)" TEXT,
        "Basic Arrival At Hospital Date Time (FD1.76)" TEXT,
        "Apparatus Resource In Quarters Date Time (FD1.74)" TEXT,
        "Apparatus Resource In Service Date Time (FD18.5.1)" TEXT,
        "Apparatus Resource Leave Scene Date Time (FD1.72)" TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """

    create_ems_raw_query = """
    DROP TABLE IF EXISTS fire_ems.ems_raw;
    CREATE TABLE fire_ems.ems_raw (
        id SERIAL PRIMARY KEY,
        "Response Incident Number (eResponse.03)" TEXT,
        "Response EMS Response Number (eResponse.04)" TEXT,
        "Response EMS Unit Call Sign (eResponse.14)" TEXT,
        "Response EMS Vehicle Unit Number (eResponse.13)" TEXT,
        "Response Level Of Care Of This Unit (3.4=eResponse.15/3.5=itResponse.115)" TEXT,
        "Incident Unit Left Scene Date Time (eTimes.09)" TEXT,
        "Incident Unit Left Scene Date Time With Not Values (eTimes.09)" TEXT,
        "Incident Patient Arrived At Destination Date Time (eTimes.11)" TEXT,
        "Incident Patient Arrived At Destination Date Time With Not Values (eTimes.11)" TEXT,
        "Incident Dispatch Priority Patient Acuity (eDispatch.05)" TEXT,
        "Disposition Destination Name Delivered Transferred To (eDisposition.01)" TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """

    incident_cols = [c for c in INCIDENT_COLUMNS.keys() if c in fire_df.columns]
    incidents_df = fire_df[incident_cols].drop_duplicates(subset=["Basic Incident Number (FD1)"])
    incidents_df = incidents_df.rename(columns=INCIDENT_COLUMNS)

    with engine.connect() as conn:
        conn.execute(text("SET search_path = fire_ems"))

        conn.execute(text(create_fire_raw_query))
        conn.execute(text(create_ems_raw_query))
        conn.commit()

        fire_df.to_sql("fire_raw", conn, schema="fire_ems", if_exists="append", index=False)
        ems_df.to_sql("ems_raw", conn, schema="fire_ems", if_exists="append", index=False)
        conn.commit()

        conn.execute(text("DELETE FROM ems_run"))
        conn.execute(text("DELETE FROM unit_response"))
        conn.execute(text("DELETE FROM incident_sensitive"))
        conn.execute(text("DELETE FROM incident"))
        conn.commit()

        incidents_df.to_sql("incident", conn, schema="fire_ems", if_exists="append", index=False)

        result = conn.execute(text("SELECT incident_id, basic_incident_number FROM fire_ems.incident"))
        incident_map = {row[1]: row[0] for row in result}

        unit_cols = ["Basic Incident Number (FD1)"]
        for c in UNIT_RESPONSE_COLUMNS.keys():
            if c in fire_df.columns:
                unit_cols.append(c)
        units_df = fire_df[unit_cols].copy()
        units_df["incident_id"] = units_df["Basic Incident Number (FD1)"].astype(str).map(incident_map)
        units_df = units_df.drop(columns=["Basic Incident Number (FD1)"])
        units_df = units_df.rename(columns=UNIT_RESPONSE_COLUMNS)
        units_df = units_df.dropna(subset=["incident_id"])
        units_df = units_df.drop_duplicates(subset=["incident_id", "apparatus_resource_id"])
        units_df.to_sql("unit_response", conn, schema="fire_ems", if_exists="append", index=False)

        ems_cols = []
        for c in EMS_RUN_COLUMNS.keys():
            if c in ems_df.columns:
                ems_cols.append(c)
        ems_runs_df = ems_df[ems_cols].copy()
        ems_runs_df["incident_id"] = ems_df["Response Incident Number (eResponse.03)"].astype(str).map(incident_map)
        ems_runs_df = ems_runs_df.rename(columns=EMS_RUN_COLUMNS)
        ems_runs_df = ems_runs_df.dropna(subset=["incident_id"])
        ems_runs_df = ems_runs_df.drop_duplicates(subset=["response_incident_number", "response_ems_response_number"])
        ems_runs_df.to_sql("ems_run", conn, schema="fire_ems", if_exists="append", index=False)

        conn.commit()

    print("Migration complete")






if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Run using python migration_script.py <fire_csv_path> <ems_csv_path>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
