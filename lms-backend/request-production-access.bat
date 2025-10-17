@echo off
echo Requesting AWS SES Production Access...
echo.

aws sesv2 put-account-details ^
--production-access-enabled ^
--mail-type TRANSACTIONAL ^
--website-url https://github.com/cyberlms ^
--additional-contact-email-addresses swarchaudhary42@gmail.com ^
--contact-language EN ^
--region us-east-1

echo.
echo Request submitted! Check your email for AWS response within 24 hours.
pause
