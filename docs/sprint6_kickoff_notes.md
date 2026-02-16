# Sprint 6 Kickoff Notes — 2/16/26

Sprint 6 runs 2/16 - 2/27. Mike added the sprint in Taiga and assigned initial tasks.
Notes below are from Frank's meeting that we're working off of.

## Frank's feedback / requested changes

Heatmap:
- days of week on vertical axis, hours on horizontal
- color scheme should go orange to red (not the current blue)
- Mike is taking this one

UHU:
- formula should be dispatch time to "back in service" / 24h
- drop the "overworked" label and category entirely
- new thresholds: underutilized < 10%, optimal 10-25%, busy 25%+
- description under the chart should explain how it's calculated and which columns
- Mike and I will coordinate on the frontend wiring

Call volume:
- label the average line (the dashed one)

Postal code chart:
- add a response mode filter button (code 2 = normal pace, code 3 = priority)
- Frank only cares about code 3 times for response analysis

Incident type breakdown:
- add EMS vs non-EMS filter

Unit tracking (new chart):
- scottsdale units going into other cities and other units entering scottsdale
- use city name, not unit ID
- Mike is handling the backend identification logic
  - scottsdale unit pattern: letter + 6 OR 3-digit number (E6, R6, L6, LT6 etc)
  - BT / WT / MC = overtime units, disregard everywhere

General:
- 90th percentile cutoff on all data to remove outliers / noise
- paginate long lists, top 20 per page

## Task split
- Mike: heatmap changes, backend Scottsdale unit identification
- Me: UHU frontend wiring, call volume label, postal code response mode filter,
       incident type EMS filter
- Mike will reach out when UHU backend changes are ready to wire in
