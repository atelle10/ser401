# Sprint 6 Frontend Task Notes — 2/18/26

Working through what I need to tackle this sprint. Mike is handling the heatmap
and backend unit classification. My side is all frontend wiring and chart updates.

## In progress / up next

### Call volume trend - average line label
Small change. The dashed avg line is already rendered, just needs a text label
on the right side of the SVG. Should say "avg" with the value. Low effort.

### UHU threshold update
Waiting on Mike to finalize the backend formula change (dispatch -> clear).
Once that's done I need to update the thresholds in the component:
  - underutilized: < 10%
  - optimal: 10 - 25%
  - busy: 25%+
Also need to remove the "overworked" bucket entirely and add a description block
under the chart explaining the formula and which columns feed into it.

### Incident type breakdown - EMS filter
Toggle button: All / EMS / Non-EMS.
Classification done client-side using keyword matching on incident_type string.
Drafted the keyword list already in incident_type_classification_notes.md.

### Postal code chart - response mode filter
Button to switch between showing all incidents vs code 3 only.
The response_mode field should come back in the postal breakdown endpoint.
Need to confirm with Mike that the field is included in the response.
If not, may need a quick backend addition or filter on the existing data.

## Blocked / waiting
- UHU wiring: waiting on Mike's backend update
- Cross-city unit chart: waiting on Mike's Scottsdale unit identification backend

## Not my lane this sprint
- Heatmap layout + color scheme (Mike)
- 90th percentile backend filtering (Mike/backend)
- Pagination (TBD, may not get to it)
