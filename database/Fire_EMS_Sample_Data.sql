-- ==========================================
-- SAMPLE DATA: Fire & EMS Core Schema
-- Author: Andrew Tellez, 1/14/2026
-- NOTE: This is dummy data for testing the schema and data ingestion pipeline.
-- ==========================================

-- INCIDENTS
INSERT INTO fire_ems.incident (
  basic_incident_number,
  basic_incident_city_name,
  basic_primary_station_name,
  basic_incident_type_code,
  basic_incident_type_code_and_description,
  basic_incident_psap_date_time,
  basic_shift_or_platoon,
  basic_incident_year,
  basic_incident_month,
  basic_incident_day_of_month,
  basic_incident_day_of_week,
  basic_incident_week,
  basic_incident_day_name,
  basic_incident_type,
  basic_incident_postal_code,
  basic_arrival_at_hospital_date_time
) VALUES
  (
    '25335331',
    'SCOTTSDALE',
    'Station 602',
    '3213',
    '3213 - EMS Call, Traumatic Injury',
    '2025-08-01 00:27:00-07',
    'B-Shift',
    2025,
    8,
    1,
    5,
    31,
    'Friday',
    'EMS Call, Traumatic Injury',
    '85251',
    '2025-08-01 01:14:00-07'
  ),
  (
    '25335460',
    'SCOTTSDALE',
    'Station 613',
    '321F',
    '321F - EMS Call, Breathing Problems',
    '2025-08-01 04:06:00-07',
    'B-Shift',
    2025,
    8,
    1,
    5,
    31,
    'Friday',
    'EMS Call, Breathing Problems',
    '85255',
    '2025-08-01 05:25:00-07'
  );

-- INCIDENT SENSITIVE
INSERT INTO fire_ems.incident_sensitive (
  incident_id,
  basic_authorization_officer_in_charge_name,
  basic_incident_latitude,
  basic_incident_longitude,
  basic_incident_full_address
) VALUES
  (
    1,
    'Captain Lopez',
    33.4942,
    -111.9261,
    '7330 E Osborn Rd, Scottsdale, AZ 85251'
  ),
  (
    2,
    'Captain Ramirez',
    33.6407,
    -111.8707,
    '15000 N Thompson Peak Pkwy, Scottsdale, AZ 85255'
  );

-- UNIT RESPONSES
INSERT INTO fire_ems.unit_response (
  incident_id,
  apparatus_resource_id,
  apparatus_resource_type_category,
  apparatus_resource_type_code,
  apparatus_resource_dispatch_date_time,
  apparatus_resource_en_route_date_time,
  apparatus_resource_arrival_date_time,
  apparatus_resource_leave_scene_date_time
) VALUES
  (
    1,
    'LT602',
    'Ground Fire Suppression',
    '11',
    '2025-08-01 00:28:00-07',
    '2025-08-01 00:29:00-07',
    '2025-08-01 00:34:00-07',
    '2025-08-01 01:14:00-07'
  ),
  (
    2,
    'M-606',
    'Medical & Rescue Unit',
    '71',
    '2025-08-01 04:19:00-07',
    '2025-08-01 04:21:00-07',
    '2025-08-01 04:29:00-07',
    '2025-08-01 05:25:00-07'
  );

-- EMS RUNS
INSERT INTO fire_ems.ems_run (
  incident_id,
  response_incident_number,
  response_ems_response_number,
  response_ems_unit_call_sign,
  response_ems_vehicle_unit_number,
  response_level_of_care_of_this_unit,
  incident_unit_left_scene_date_time,
  incident_patient_arrived_at_destination_date_time,
  incident_dispatch_priority_patient_acuity,
  disposition_destination_name_delivered_transferred_to,
  scene_gps_latitude,
  scene_gps_longitude
) VALUES
  (
    1,
    '25335331',
    '20250801-18491',
    'LT602',
    'LT602',
    'ALS-Paramedic',
    '2025-08-01 00:51:00-07',
    '2025-08-01 00:54:00-07',
    'Lower Acuity',
    'HonorHealth Osborn',
    33.4942,
    -111.9261
  ),
  (
    2,
    '25335460',
    '20250801-18540',
    'M-606',
    'M-606',
    'ALS-Paramedic',
    '2025-08-01 04:54:00-07',
    '2025-08-01 05:25:00-07',
    'Lower Acuity',
    'HonorHealth Thompson Peak',
    33.6407,
    -111.8707
  );
