# Rental contracts

Pure TypeScript models, illustrative reference catalogue, trip serialization and time-zone-aware quote calculations shared between Aventra's React website and server API.

Billing rule (initial): every begun 24-hour rental period counts as a day, minimum one day and maximum 30 days. Date/time inputs are interpreted in the rental location's IANA time zone. Nonexistent clock times during a daylight-saving transition are invalid; ambiguous times select the earlier instant. One-way returns require operator review and may carry fees not included in the base estimate.

**Do not treat illustrative prices as real offers.** Both frontend and backend should display this limitation. Server-side calculations are authoritative for received enquiries, not browser-provided totals.
