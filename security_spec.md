# Security Specification: Live Unique Portfolio Visitor Tracking

## 1. Data Invariants
1. **Anonymous Identity Integrity**: Every visitor document at `/visitors/{visitorId}` must strictly match the authenticated user's anonymous UID (`request.auth.uid == visitorId`).
2. **Immutable Identity & Creation Time**: The `uid` and `firstVisitAt` fields cannot be modified after creation.
3. **Atomic Aggregation Bounds**: Updates to `/stats/portfolio` can only increment `totalUniqueVisitors` by exactly 1 during a new visitor creation transaction, or keep it unchanged during a revisit update. Arbitrary overwrites or counter resetting by clients is forbidden.
4. **Active Session Ownership**: A session record at `/active_sessions/{sessionId}` can only be created, updated, or deleted by the visitor matching `request.auth.uid == sessionId`.
5. **No PII Storage**: Visitor tracking documents contain only anonymous UIDs and timestamps. No names, emails, IPs, or device fingerprints are stored.

## 2. The Dirty Dozen Payloads & Negative Assertions
1. **Unauthenticated Write**: An unauthenticated request attempting to write to `/visitors/some_id` -> `PERMISSION_DENIED`.
2. **Identity Spoofing**: User `uid_A` attempting to write to `/visitors/uid_B` -> `PERMISSION_DENIED`.
3. **Arbitrary Counter Overwrite**: User attempting to set `/stats/portfolio.totalUniqueVisitors = 999999` directly -> `PERMISSION_DENIED`.
4. **Counter Decrement Attack**: User attempting to decrement `/stats/portfolio.totalUniqueVisitors` -> `PERMISSION_DENIED`.
5. **Session Hijacking**: User `uid_A` attempting to delete `/active_sessions/uid_B` -> `PERMISSION_DENIED`.
6. **Ghost Fields Injection**: User sending unregistered fields in visitor document (e.g. `isAdmin: true`) -> `PERMISSION_DENIED`.
7. **Oversized String Attack**: User sending a 100KB UID string -> `PERMISSION_DENIED`.
8. **Client Timestamp Tampering**: Client supplying arbitrary timestamp instead of server `request.time` -> `PERMISSION_DENIED`.
9. **Blanket Collection Scraping**: An unauthorized user attempting to list all individual visitors in `/visitors` -> `PERMISSION_DENIED`.
10. **Delete Visitor Record**: An anonymous visitor attempting to delete their or others' historical visitor records -> `PERMISSION_DENIED`.
11. **Delete Stats**: Attempting to delete the global stats document `/stats/portfolio` -> `PERMISSION_DENIED`.
12. **Foreign Collection Write**: Attempting to create unauthorized collections -> `PERMISSION_DENIED` (by global default-deny).
