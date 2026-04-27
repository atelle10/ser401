# KPI Calculation Formulas and Data Sources

## Overview
This document describes the calculation formulas and database columns used for each KPI displayed on the dashboard.

---

## Unit Hour Utilization (UHU)

### Formula
```
UHU = (Total Busy Hours / Time Period Hours) × 100
```

Where:
- **Total Busy Hours** = Sum of (clear_time - dispatch_time) for all incidents handled by the unit
- **Time Period Hours** = Duration of the selected date range in hours

### Thresholds
| Range | Category | Color |
|-------|----------|-------|
| < 10% | Underutilized | Gray |
| 10-25% | Optimal | Green |
| 25%+ | Busy | Orange |

### Data Source Columns
- `unit_response.apparatus_resource_dispatch_date_time` - When unit was dispatched
- `unit_response.apparatus_resource_clear_date_time` - When unit cleared the scene

### Data Quality Filters
- Reject records where clear_time <= dispatch_time
- Reject records where busy duration exceeds 24 hours (data anomaly)

---

## Average Response Time

### Formula
```
Avg Response Time = Mean(arrival_time - dispatch_time)
```

### Data Source Columns
- `unit_response.apparatus_resource_dispatch_date_time`
- `unit_response.apparatus_resource_arrival_date_time`

### Notes
- Measured in minutes
- Excludes records with missing timestamps

---

## Incident Type Classification (EMS vs Non-EMS)

### Classification Logic
Incidents are classified based on keyword matching in the incident type field.

**EMS Keywords:**
- medical, ambulance, cardiac, respiratory, trauma
- ems, patient, injury, illness, overdose
- breathing, chest pain, unconscious

**Non-EMS (Fire/Other):**
- fire, smoke, alarm, hazmat
- rescue, vehicle, structure
- All types not matching EMS keywords

### Data Source
- `incident.basic_incident_type`

---

## Peak Load Factor

### Formula
```
Peak Load Factor = Max Hourly Incidents / Avg Hourly Incidents
```

### Interpretation
- Value of 1.0 = Uniform distribution
- Higher values = More pronounced peaks

---

## Call Volume Trend

### Aggregation
- Daily incident counts within selected date range
- 7-day rolling average overlay

### Data Source
- `incident.basic_incident_psap_date_time` - Incident timestamp

---

## Heatmap: Incidents by Day × Hour

### Grid
- X-axis: Hour of day (0-23)
- Y-axis: Day of week (Mon-Sun)
- Cell value: Incident count

### Data Source
- Derived from `incident.basic_incident_psap_date_time`

---

## Related Documentation
- See `sprint6-kpi-review.md` for validation checklist
- Backend API: `/api/incidents/kpi-data`
