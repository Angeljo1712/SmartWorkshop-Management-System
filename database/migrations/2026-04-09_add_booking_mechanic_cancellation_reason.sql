ALTER TABLE bookings
  ADD COLUMN mechanic_cancelled_reason TEXT NULL AFTER status,
  ADD COLUMN mechanic_cancelled_at DATETIME NULL AFTER mechanic_cancelled_reason;
