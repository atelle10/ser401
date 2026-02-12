# Sprint 5 Validation Notes

Ran through the dashboard with the backend running locally today. A few things to note
before we push for sprint review.

## What's working
- Region filter (South/North/All) correctly updates all charts
- Date range presets (7/14/30 days) work and re-fetch on change
- Custom date inputs work, validated start < end check
- Heatmap renders from API data
- Postal code breakdown loads and displays top 10

## Still rough
- Call volume trend: the granularity toggle (daily/weekly/monthly) works but
  the weekly aggregation sometimes shows one extra data point at the tail end.
  Probably a bucketing edge case. Not blocking.
- UHU component: showing data but thresholds are wrong per Frank's numbers.
  Keeping this as a known issue for now, will revisit in sprint 6.
- Incident type chart: renders fine, but no filter yet. EMS vs non-EMS split
  was mentioned in the last meeting, need to add that.

## Build / lint
- lint passes clean
- build passes clean
- no console errors with real data connected

## Open items going into sprint 6
- Response mode (code 2 vs code 3) filter on postal code chart
- UHU threshold adjustment
- Label the average line on call volume
- EMS filter on incident type breakdown
