
export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #dcdced; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        p { color: #666; }
        .otp { font-size: 24px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Email Verification</h1>
        <p>Hello {{email}},</p>
        <p>Thank you for registering! Please verify your email address using the OTP below.</p>
        <div class="otp">{{OTP}}</div>
        <p>This OTP will expire in 60 minutes. If you did not create an account, please ignore this email.</p>
    </div>
</body>
</html>
`



export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #dcdced; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        p { color: #666; }
        .otp { font-size: 24px; font-weight: bold; color: #dc3545; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset</h1>
        <p>Hello {{email}},</p>
        <p>You requested a password reset. Use the OTP below to reset your password.</p>
        <div class="otp">{{OTP}}</div>
        <p>This OTP will expire in 60 minutes. If you did not request this, please ignore this email.</p>
    </div>
</body>
</html>
`