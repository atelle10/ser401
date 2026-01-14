# Sprint 4 KPI Dashboard Planning
**Date:** January 14, 2026  
**Author:** Zachary Alexander  
**User Story:** #8662539 - KPI Visualization and Analytics Charts

## Objective
Connect the existing KPI dashboard components to real database data and implement additional KPI metrics based on the statistics work completed in previous sprints.

## Current State Analysis

### Existing KPI Components
The dashboard currently has several functional visualization components:
- **HeatMapDayHour.jsx** - Shows incident volume by day of week × hour of day
- **CallVolumeLinearChart.jsx** - Displays call volume trends over time
- **UnitHourUtilization.jsx** - Calculates and displays resource utilization metrics
- **KPI_1.jsx through KPI_4.jsx** - Placeholder components awaiting implementation

### Data Requirements
All components expect incident data with the following schema:
- `timestamp` - ISO 8601 datetime
- `postal_code` - Numeric postal code for regional filtering
- `unit_id` - Unit identifier (e.g., 'E101', 'R202')
- `en_route_time` - Datetime when unit was dispatched
- `clear_time` - Datetime when unit became available again

### Database Status
Mike is working on:
- PostgreSQL migration scripts for fire_raw and ems_raw tables
- Data append functionality for new CSV imports
- Database connection setup for the application

## Tasks Breakdown

### Task #8639081: Connect Dashboard KPIs to Real Database
**Priority:** High  
**Dependencies:** Mike's database migration completion

**Steps:**
1. Review database schema and available tables
2. Create data service layer for incident queries
3. Replace mock data with API calls or direct database queries
4. Add loading states and error handling
5. Test with real data volume

### Task #8639082: Implement Additional KPI Metrics
**Priority:** High  
**Dependencies:** KPI definitions from Frank's feedback

**Planned KPIs:**
- KPI_1: Average Response Time
- KPI_2: Total Incident Count (with trend)
- KPI_3: Active Units Count
- KPI_4: Critical Incidents Percentage

### Task #8639083: Review and Adjust Stats Based on Frank's Feedback
**Priority:** Medium  
**Dependencies:** Access to Frank's feedback notes

**Action Items:**
- Locate previous meeting notes with Frank's feedback
- Review statistics notebook outputs (stats_kpis.ipynb)
- Identify required adjustments to calculations
- Update KPI components accordingly

### Task #8639084: Database Query Optimization
**Priority:** Medium  
**Dependencies:** Real data connection established

**Focus Areas:**
- Query performance with large datasets
- Caching strategy for frequently accessed data
- Pagination or aggregation for time-range queries
- Performance benchmarks and monitoring

## Technical Considerations

### Data Flow Architecture
```
Database (PostgreSQL)
    ↓
Data Service Layer (to be created)
    ↓
React Context/State Management
    ↓
KPI Components
```

### Performance Targets
- Initial dashboard load: < 3 seconds
- Filter changes: < 1 second
- Support 1+ year of incident data

### Regional Filtering
- South Scottsdale (Urban): postal_code < 85260
- North Scottsdale (Rural): postal_code >= 85260

## Coordination Points

### With Mike Krasnik
- Database schema documentation
- Connection string and credentials
- Migration script completion timeline
- Data volume estimates

### With Leroy S
- UI/UX priorities for KPI cards
- Which metrics are most important
- Mobile responsiveness verification

### With Team
- Frank's feedback review
- KPI metric definitions
- Testing with real data

## Timeline Estimate
- Week 1 (Jan 14-18): Planning, data service layer, KPI definitions
- Week 2 (Jan 19-25): Implementation, testing, optimization

## Next Steps
1. Coordinate with Mike on database status
2. Review stats notebook for KPI calculations
3. Begin data service layer implementation
4. Create KPI metric calculation utilities
