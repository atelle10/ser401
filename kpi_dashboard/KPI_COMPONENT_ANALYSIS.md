# KPI Component Technical Analysis
**Date:** January 16, 2026  
**Author:** Zachary Alexander  
**Sprint:** Sprint 4  
**Related Tasks:** #8639081, #8639082, #8639083

## Purpose
Technical analysis of existing KPI components to identify data requirements, prop interfaces, and implementation gaps before connecting to real database.

## Component Inventory

### 1. HeatMapDayHour.jsx
**Status:** Functional, needs real data  
**Prop Interface:**
```javascript
{
  data: Array<{
    timestamp: string,
    postal_code: number
  }>,
  region: 'south' | 'north'
}
```

**Functionality:**
- Aggregates incidents by day of week (0-6) and hour (0-23)
- Filters by postal code for regional analysis
- Time window selector (1, 5, or 12 weeks)
- Color-coded heat map visualization

**Data Processing:** O(n) single pass through incidents  
**Performance:** Efficient with useMemo caching

**Observations:**
- Regional filter threshold: postal_code < 85260 for South
- Handles empty data gracefully
- Responsive design with overflow handling

### 2. CallVolumeLinearChart.jsx
**Status:** Functional, needs real data  
**Prop Interface:**
```javascript
{
  data: Array<{
    timestamp: string,
    postal_code: number
  }>,
  region: 'south' | 'north'
}
```

**Functionality:**
- Time series aggregation (daily, weekly, monthly)
- SVG-based line chart with data points
- Average line overlay
- Regional filtering

**Data Processing:** Map-based bucketing by time period  
**Performance:** Efficient aggregation, responsive SVG

**Observations:**
- Lookback periods: 30 days (daily), 84 days (weekly), 365 days (monthly)
- Automatic label spacing to prevent overlap
- Hover tooltips on data points

### 3. UnitHourUtilization.jsx
**Status:** Functional, needs real data  
**Prop Interface:**
```javascript
{
  data: Array<{
    unit_id: string,
    en_route_time: string,
    clear_time: string
  }>,
  timePeriodHours: number (default: 24)
}
```

**Functionality:**
- Calculates busy hours per unit
- UHU percentage: (busy_hours / time_period) × 100
- Color-coded by utilization level
- Unit type detection from ID prefix

**Data Processing:** O(n) aggregation with sanity checks  
**Performance:** Efficient, sorts by utilization

**Observations:**
- Rejects invalid time ranges (clear <= en_route)
- Rejects impossibly long incidents (>24 hours)
- Industry-standard thresholds: <30% underutilized, 30-60% optimal, 60-80% busy, >80% overworked

### 4. KPI_1.jsx through KPI_4.jsx
**Status:** Placeholder components, need implementation  
**Current State:** Static UI shells with no data processing

**Required Implementation:**
Each KPI card needs:
- Data prop interface
- Calculation logic
- Value display
- Trend indicator (up/down, good/bad)
- Description text

## Data Schema Standardization

### Unified Incident Data Type
Based on component analysis, the complete incident data type should be:

```typescript
interface IncidentData {
  // Required for all components
  timestamp: string;           // ISO 8601 datetime
  
  // For regional filtering (HeatMap, CallVolume)
  postal_code: number;
  
  // For UHU calculations
  unit_id: string;
  en_route_time: string;       // ISO 8601 datetime
  clear_time: string;          // ISO 8601 datetime
  
  // Optional for future KPIs
  incident_type?: string;      // 'Fire', 'EMS', etc.
  priority?: number;
  response_time_seconds?: number;
}
```

## Prop Mismatch Issues Found

### Dashboard.jsx Current State
**Problem:** Dashboard passes `incidents={...}` but components expect `data={...}`

**Impact:** Components receive undefined data, show "No data available" messages

**Fix Required:**
```javascript
// Current (incorrect)
<HeatMapDayHour incidents={mockIncidentData} ... />
<UnitHourUtilization incidents={mockIncidentData} />
<CallVolumeLinearChart incidents={mockIncidentData} ... />

// Corrected
<HeatMapDayHour data={mockIncidentData} ... />
<UnitHourUtilization data={mockIncidentData} />
<CallVolumeLinearChart data={mockIncidentData} ... />
```

## KPI Card Implementation Plan

### KPI_1: Average Response Time
**Metric:** Average time from incident creation to unit en route  
**Data Required:** `timestamp`, `en_route_time`  
**Calculation:** `avg((en_route_time - timestamp) for all incidents)`  
**Trend:** Lower is better (green down arrow)

### KPI_2: Total Incident Count
**Metric:** Count of incidents in time window  
**Data Required:** `timestamp`  
**Calculation:** `count(incidents in time_window)`  
**Trend:** Compare to previous period (context-dependent)

### KPI_3: Active Units
**Metric:** Number of unique units responding to incidents  
**Data Required:** `unit_id`  
**Calculation:** `count(distinct unit_id)`  
**Trend:** Higher indicates better coverage (green up arrow)

### KPI_4: Critical Incident Rate
**Metric:** Percentage of high-priority incidents  
**Data Required:** `priority` or `incident_type`  
**Calculation:** `(count(critical) / count(total)) × 100`  
**Trend:** Lower is better (green down arrow)

## Database Integration Requirements

### Query Patterns
1. **Time-range queries:** Most components filter by timestamp
2. **Regional queries:** Postal code filtering for South/North
3. **Unit-specific queries:** For UHU calculations
4. **Aggregation queries:** For KPI cards

### API Endpoint Design (Proposed)
```
GET /api/incidents?start=YYYY-MM-DD&end=YYYY-MM-DD&region=south
GET /api/incidents/stats?metric=response_time&period=7d
GET /api/units/utilization?period=24h
```

### Caching Strategy
- Cache incident data by day (immutable once day is complete)
- Real-time data only for current day
- Invalidate cache on data append operations

## Performance Considerations

### Current Mock Data Limitations
- Only 5 sample incidents
- Cannot test performance with realistic volumes
- Cannot validate time-range filtering edge cases

### Expected Production Data Volume
- Estimated: 50-200 incidents per day
- 1 year = ~18,000-73,000 records
- Dashboard should handle full year without pagination

### Optimization Strategies
1. **Frontend:** useMemo for expensive calculations
2. **Backend:** Database indexes on timestamp, postal_code, unit_id
3. **Network:** Compress responses, limit fields returned
4. **UX:** Loading skeletons, progressive data loading

## Testing Strategy

### Unit Tests Needed
- Data aggregation functions
- Regional filtering logic
- Time bucketing accuracy
- UHU calculation edge cases

### Integration Tests Needed
- Dashboard with real database connection
- Filter changes trigger correct queries
- Error handling for network failures
- Loading states display correctly

### Performance Tests Needed
- Dashboard load time with 1 year of data
- Filter change response time
- Memory usage with large datasets

## Next Steps

1. **Immediate (Jan 16-17):**
   - Fix prop name mismatch in Dashboard.jsx
   - Update mock data to match complete schema
   - Verify all components render with corrected props

2. **Short-term (Jan 18-20):**
   - Implement KPI_1 through KPI_4 calculations
   - Add TrendIndicator component integration
   - Create data service layer abstraction

3. **Medium-term (Jan 21-25):**
   - Connect to real database (pending Mike's migration)
   - Add loading/error states
   - Performance testing and optimization
   - Final polish and edge case handling

## Dependencies

- **Mike Krasnik:** Database migration completion, schema documentation
- **Leroy S:** KPI priority decisions, UI/UX review
- **Team:** Frank's feedback on stat calculations

## Risks and Mitigations

**Risk:** Database not ready by Jan 21  
**Mitigation:** Continue with enhanced mock data, create data service abstraction layer

**Risk:** KPI calculations don't match Frank's requirements  
**Mitigation:** Review stats notebook early, get team validation before implementation

**Risk:** Performance issues with large datasets  
**Mitigation:** Implement pagination/aggregation at database level, not frontend

## Conclusion

The existing KPI components are well-architected and ready for real data. Primary blockers are:
1. Prop name mismatch (quick fix)
2. Mock data schema mismatch (quick fix)
3. KPI_1-4 implementation (2-3 days work)
4. Database connection (external dependency)

With these addressed, the dashboard will be production-ready for Sprint 4 completion.
