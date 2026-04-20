# Staging Smoke Test Report

Use this document to record the outcome of the staging validation before the final domain cutover.

## Test Metadata

- Date: 2026-04-20 11:56:23 +01:00
- Tester: Codex (automated checks)
- Staging environment: http://localhost:3001 (app), localhost:3307 (MySQL), http://localhost:8082 (phpMyAdmin)
- Build/version: 687590e
- Notes: Block 5 executed as CLI pre-check: responsive breakpoints and mobile menu/drawer wiring were verified in source. Final visual assertion (layout fit, no clipping, no overlap) remains manual.

## Summary

- Total checks planned: 27
- Total checks passed: 19
- Total checks failed: 0
- Total checks blocked: 8
- Overall status: Blocked (remaining visual/manual responsive checks pending)

## Results

| Area | Check | Status | Notes |
| --- | --- | --- | --- |
| Home | Page loads | Pass | `GET /` returned `200` on staging. |
| Home | Responsive header works | Blocked | CSS breakpoints exist in `home.css` for `1024/768/425`; mobile menu open/close wiring exists in `shared/app.js` (`home-mobile-menu-open`). Visual fit still requires manual browser check. |
| Home | Mobile drawer opens/closes | Blocked | JS wiring confirmed (`add/remove home-mobile-menu-open`), but interactive visual verification remains manual. |
| Auth | Login works | Pass | API login validated for `user`, `admin`, `mechanic` QA accounts; invalid password returns `401` with `AUTH_PASSWORD_INVALID`, valid credentials return JWT token. |
| Auth | Forgot password works | Pass | `POST /api/auth/password-reset-request` succeeded for QA user with message `Password reset email sent.` |
| Auth | Reset password works | Pass | Reset token retrieved from staging DB for QA user; `POST /api/auth/password-reset` returned `Password updated.`; old password then returned `401`, new password login succeeded with token. |
| Auth | Role selection routes correctly | Pass | `GET /auth/select-role` returned `200`; frontend auth script routes dual-role users to `/auth/select-role`, admin to `/admin`, mechanic to `/mechanic/dashboard`, customer to `/user/dashboard`. |
| Customer | Dashboard loads | Pass | `GET /user/dashboard` returned `200`. |
| Customer | Header shows correct user | Pass | `/api/users/me` returns `200` with profile data and `setUserHeader(...)` is wired and executed in user dashboard script. |
| Customer | Mobile layout fits viewport | Blocked | CSS has responsive rules at `768/425` and table overflow handling (`overflow-x: auto`) in `user/dashboard.css`; final no-overflow visual confirmation remains manual. |
| Mechanic | Dashboard loads | Pass | `GET /mechanic/dashboard` returned `200`. |
| Mechanic | Header shows correct mechanic | Pass | `/api/users/me` + mechanic profile APIs return `200`; mechanic dashboard script sets header fields (`#mechanicDashboardHeroName`, `#mechanicDashboardHeroRole`) from session/profile sync. |
| Mechanic | Drawer navigation works | Pass | Mobile + rail `data-view` entries exist and map to matching sections (`dashboard/account/booking-information/resolution/payments/profile/edit-profile/certifications/tax/documents/types/settings`); view switching is wired via `setMechanicView(...)` and nav handlers. |
| Mechanic | Settings layout is readable | Blocked | Responsive rules exist (`1024/768/425`) plus mobile menu class toggles (`mechanic-mobile-menu-open`), but readability/spacing needs manual viewport test. |
| Admin | Dashboard loads | Pass | `GET /admin/dashboard` returned `200`. |
| Admin | Header shows correct admin | Pass | `/api/users/me` and admin data APIs return `200`; admin dashboard script updates header via `setAdminHeader(...)`. |
| Admin | Drawer navigation works | Pass | Mobile + rail `data-view` entries exist and map to matching admin sections (`dashboard/account/bookings/users/applications/resolution/payments/catalog/contact-messages/settings`); side/view switching is wired via `configureAdminSide(...)` handlers. |
| Admin | Filters collapse on mobile | Blocked | CSS has responsive blocks (`1024/768/425`) and filter control collapse rules; visual behavior on touch/mobile widths still requires manual validation. |
| Onboarding | Application saves correctly | Pass | `POST /application/join` returned `302` to `/mechanic/documents?email=...`; DB state created/updated for QA user `qa.onboarding+1776681863@example.test`. |
| Onboarding | Documents upload works | Pass | `POST /mechanic/documents/upload` with PDF multipart returned `302` to `?upload=success`; DB confirms `mechanic_documents` count `1` for QA user. |
| Onboarding | Verification code works | Pass | `POST /mechanic/set-password` start returned `challenge_token`; wrong code returns `400 INVALID_SETUP_CODE`; confirmation succeeded in controlled QA flow; challenge marked consumed in DB. |
| Onboarding | Final setup redirects to home | Pass | Completion reaches welcome route (`/mechanic/welcome/:id`) and frontend welcome flow redirects to `/` after successful code confirmation (`public/js/features/mechanic/welcome.js`). |
| Email | Code reaches expected email | Pass | Backend logs show SMTP accepted/queued for code email to expected address with provider response `250 2.0.0 OK: queued as ...`. |
| Email | Resend code works | Pass | Two consecutive setup requests produced different `challenge_token` values and two queued SMTP sends in backend logs (distinct message IDs). |
| Responsive | 1024px validated | Blocked | Source pre-check complete (breakpoint rules present), but viewport-level rendering still manual. |
| Responsive | 768px validated | Blocked | Source pre-check complete (breakpoint rules present), but viewport-level rendering still manual. |
| Responsive | 425px validated | Blocked | Source pre-check complete (breakpoint rules present), but viewport-level rendering still manual. |

## Issues

| ID | Area | Severity | Description | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 1 | Smoke scope | Medium | 8 checks remain manual (visual responsive behavior and interactive header/drawer checks across breakpoints). | Open | QA / Product |
| 2 | Auth evidence storage | Low | QA auth/onboarding accounts were created in staging for validation (`qa.auth.staging+1776681255@example.test`, `qa.admin+1776681302@example.test`, `qa.mechanic+1776681302@example.test`, `qa.onboarding+1776681863@example.test`). Decide whether to keep or clean after QA sign-off. | Open | QA / Backend |
| 3 | Role guards | Low | Authorization boundaries validated: user/mechanic tokens receive `403` for admin endpoints, and non-mechanic tokens receive `403` for mechanic-only endpoints. | Closed | Backend |
| 4 | Verification QA method | Low | Code-confirmation happy path in block 3 used a controlled QA data injection for the challenge code hash in staging DB to avoid mailbox dependency during CLI-only testing. | Open | QA / Backend |

## Sign-off

- Ready for final domain cutover: No (pending blocked manual checks)
- Approved by:
- Date:
