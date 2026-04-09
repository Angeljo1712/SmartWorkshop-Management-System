ALTER TABLE payments
  ADD COLUMN payment_method VARCHAR(32) NULL AFTER currency,
  ADD COLUMN card_last4 CHAR(4) NULL AFTER payment_method;
