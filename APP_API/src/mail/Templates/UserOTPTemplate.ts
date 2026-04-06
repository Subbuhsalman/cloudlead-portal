import { APP_URL } from "../../constants/Constants";

export const generateOtpTemplate = (otp: number, username: string): string => {
    return `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloud Lead - Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fa; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 30px;">
        <!-- Logo -->
        <div style="display: flex; align-items: center; margin-bottom: 40px;">
            <img src="${APP_URL}/assets/landing/logo.png" />
        </div>

        <!-- Main Content -->
        <div style="margin-bottom: 40px;">
            <p style="font-size: 16px; color: #555; margin-bottom: 30px;">Enter this temporary verification code to continue:</p>
            
            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
                <div style="font-size: 32px; font-weight: 600; color: #333; letter-spacing: 4px; font-family: 'Courier New', monospace;">${otp}</div>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 40px;">Please ignore this email if this wasn't you trying to create a Cloud Lead account.</p>
        </div>

        <!-- Signature -->
        <div style="margin-bottom: 60px;">
            <div style="font-size: 14px; color: #666; margin-bottom: 4px;">Best,</div>
            <div style="font-size: 14px; color: #999;">Cloud Lead</div>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #eee; padding-top: 30px;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                      <img src="${APP_URL}/assets/landing/logo.png" />


            </div>
            <div style="font-size: 14px; color: #666; margin-bottom: 8px;">Cloud Lead</div>
            <div style="font-size: 14px; color: #999;"><a href="#" style="color: #667eea; text-decoration: none;">Help center</a></div>
        </div>
    </div>
</body>
</html>
  `;
}