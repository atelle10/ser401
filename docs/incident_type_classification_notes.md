# Incident Type Classification Notes

Looking at the incident_type values coming back from the API to figure out how to
split EMS vs non-EMS for the breakdown chart filter.

From the data sample I pulled locally, types include things like:
- Medical Aid, Chest Pain, Stroke, Overdose, Fall, Diabetic, Unconscious
- Structure Fire, Brush Fire, Smoke Investigation, Gas Leak
- Vehicle Accident, Rescue, Hazmat
- Public Assist, Alarm, Mutual Aid

The EMS split is fairly clear - anything medical in nature falls under EMS.
Non-EMS covers fire and other categories. But a few are ambiguous:
- Vehicle Accident can go either way (trauma vs fire)
- Rescue is sometimes fire-related, sometimes medical

Plan for the filter: instead of trying to hardcode a classification list server-side,
add a simple client-side filter in the IncidentTypeBreakdown component that checks
whether the type string contains known EMS keywords. If the string includes
"Medical", "Aid", "Pain", "Stroke", "OD", "Overdose", "Fall", "Diabetic",
"Cardiac", "Respiratory", "Unconscious" - classify as EMS.
Everything else defaults to non-EMS.

This is good enough for a first pass. Frank can give us a formal list later if needed.

The filter should be a toggle button on the chart - "All / EMS / Non-EMS".
Default to All so it doesn't change existing behavior.
