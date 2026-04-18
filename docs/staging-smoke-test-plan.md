# Staging Smoke Test Plan

This document defines the manual smoke test plan for the SmartWorkshop staging environment.
It is intended to validate the application before the final domain cutover.

## Goal

Verify that the staging stack is isolated, usable, and ready for end-to-end validation with test data.

## Staging Environment

- App: `http://localhost:3001`
- MySQL: `localhost:3307`
- phpMyAdmin: `http://localhost:8082`

## Required Test Data

Create or confirm the following sample records in staging:

- Admin account
- Customer account
- Mechanic account
- At least one vehicle per customer
- At least one mechanic application
- At least one uploaded document set
- At least one booking in each relevant status:
  - requested
  - completed
  - cancelled
  - in progress

## Smoke Test Checklist

### 1. Public Home

- Open the home page.
- Confirm the page loads without console errors.
- Confirm the responsive header is correct on desktop, tablet, and mobile.
- Confirm the mobile drawer opens and closes.

### 2. Authentication

- Open login.
- Sign in with each role account.
- Confirm invalid credentials show a clear error.
- Confirm forgot-password displays the reset flow.
- Confirm reset-password accepts a valid token and shows validation errors when data is invalid.
- Confirm select-role routes to the correct destination.

### 3. Customer Dashboard

- Open the customer dashboard.
- Confirm the header shows the logged-in customer name.
- Confirm the mobile header uses the hamburger menu.
- Confirm the dashboard cards, vehicle cards, and forms render correctly.
- Confirm account/settings views stay inside the viewport on mobile.

### 4. Mechanic Dashboard

- Open the mechanic dashboard.
- Confirm the header shows the logged-in mechanic name.
- Confirm the rail hides on tablet and mobile.
- Confirm the hamburger menu opens the full mechanics drawer.
- Confirm all drawer items navigate correctly:
  - dashboard
  - account
  - booking information
  - resolution center
  - payments
  - profile
  - edit profile
  - certification
  - tax information
  - document
  - type of work covered
  - settings
- Confirm the settings layout remains readable on mobile.

### 5. Admin Dashboard

- Open the admin dashboard.
- Confirm the header shows the logged-in admin name.
- Confirm the rail hides on tablet and mobile.
- Confirm the hamburger menu opens the admin drawer.
- Confirm the bookings table filters collapse correctly on small screens.
- Confirm the drawer navigation works for all admin sections.

### 6. Mechanic Onboarding

- Start a mechanic application.
- Confirm the application data is saved.
- Confirm the documents page receives the correct email.
- Upload the required documents.
- Confirm uploaded files appear in the list before submission.
- Confirm the verification code step appears.
- Confirm the activation code is accepted.
- Confirm the account setup completes and redirects to home.

### 7. Email and Code Verification

- Confirm the verification code is generated.
- Confirm the code is sent to the expected email address.
- Confirm resend code works.
- Confirm the backend logs show a queued or delivered message.
- Confirm the flow still works if the email provider queues the message instead of sending instantly.

### 8. Responsive Breakpoints

- Validate `1024px` layout behavior.
- Validate `768px` layout behavior.
- Validate `425px` layout behavior.
- Confirm no horizontal scrolling appears unexpectedly.
- Confirm all key content remains inside the viewport.

## Expected Exit Criteria

- All core routes load successfully in staging.
- Role-specific navigation works.
- Forms submit without 4xx/5xx errors.
- Email/code flow works end to end.
- No critical responsive regressions remain on the target breakpoints.

## Notes

- This plan is for staging only.
- Keep staging data separate from local development data.
- Reuse the staging stack for regression checks before any production cutover.
