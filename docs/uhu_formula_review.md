# UHU Formula Review

Went back through how UHU is being calculated in the component. Currently using
en_route_time to clear_time divided by timePeriodHours (default 24h). This is close
but not exactly what Frank described - he said dispatch to "back in service" or "clear".

Need to confirm which timestamp field represents "back in service" in the data. Looking
at the incident records we have: dispatch_time, en_route_time, arrival_time, clear_time.
Frank's definition maps more closely to dispatch_time -> clear_time.

Also the current threshold labels don't match what leadership uses:
- they said < 10% underutilized, 10-25% optimal, 25%+ busy
- current code has < 30%, 30-60%, 60-80%, 80%+ overworked
- need to reconcile this before presenting to Frank again

Current component filters out incidents where clear <= en_route or time gap > 24h.
That sanity check is fine but should double check it isn't dropping too many records.

Questions to follow up with Mike on:
- what does "back in service" map to in the DB schema
- do we have enough data to test the 90th percentile filtering idea
- should UHU be per unit per day, or averaged across the whole time window
