UPDATE user_security_settings uss
JOIN users u ON u.id = uss.user_id
SET uss.two_factor_email_enabled = 0
WHERE u.email = 'zang17@hotmail.com';

INSERT INTO user_security_settings (user_id, two_factor_email_enabled)
SELECT u.id, 0
FROM users u
WHERE u.email = 'zang17@hotmail.com'
ON DUPLICATE KEY UPDATE two_factor_email_enabled = VALUES(two_factor_email_enabled);
