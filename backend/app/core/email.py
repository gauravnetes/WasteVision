import smtplib
from email.mime.text import MIMEText
import os
from app.core.config import settings

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "your-email@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your-app-password")
FROM_EMAIL = os.getenv("FROM_EMAIL", "your-email@gmail.com")


def send_email(to_email: str, subject: str, body: str) -> bool:
    try:
        msg = MIMEText(body, "html")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_FROM_EMAIL
        msg["To"] = to_email

        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_FROM_EMAIL, [to_email], msg.as_string())
        server.quit()
        print("✅ Email sent successfully")
        return True
    except Exception as e:
        print("❌ Error sending email:", e)
        return False


def send_verification_email(to_email: str, verification_code: str, user_name: str) -> bool:
    subject = "Verify Your Email - Waste Vision"
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Waste Vision - Email Verification</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap');
body {{
    font-family: 'Inter', Arial, sans-serif;
    background: #eef5ef;
    margin: 0;
    padding: 0;
    color: #26332a;
    font-weight: 600;
}}
.email-wrapper {{
    width: 100%;
    padding: 30px 0;
    background: #eef5ef;
}}
.container {{
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 6px 22px rgba(0,0,0,0.1);
    border: 1px solid #c7e1cf;
}}
.header {{
    background: linear-gradient(135deg, #7ab159, #7ab159);
    color: #fff;
    text-align: center;
    padding: 35px 20px;
}}
.header h2 {{
    margin: 0;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: 0.6px;
}}
.content {{
    padding: 30px 25px;
    line-height: 1.8;
    font-size: 16px;
    color: #2b3a30;
}}
.content p {{
    margin: 18px 0;
}}
.code {{
    display: block;
    font-size: 26px;
    font-weight: 800;
    background: #e8f5e9;
    color: #679e4f;
    padding: 18px;
    margin: 28px 0;
    border-radius: 12px;
    text-align: center;
    letter-spacing: 4px;
    border: 1px solid #679e4f;
    box-shadow: inset 0 2px 5px rgba(103, 158, 79, 0.12);
}}
.brand-line {{
    margin-top: 28px;
    padding: 18px 20px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    color: #000000;
    background: #f1faf2;
    border-radius: 10px;
    border: 1px solid #679e4f;
}}
.footer {{
    padding: 22px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #4d5c54;
    background-color: #eef5ef;
    border-top: 1px solid #c7e1cf;
}}
.highlight-user {{ color: #000000; font-weight: 800; }}
.highlight-wv {{ color: #000000; font-weight: 800; }}
@media screen and (max-width: 640px) {{
    .container {{ width: 92% !important; }}
    .header h2 {{ font-size: 22px !important; }}
    .code {{ font-size: 22px !important; padding: 14px !important; }}
    .content {{ font-size: 15px !important; }}
    .brand-line {{ font-size: 15px !important; }}
}}
</style>
</head>
<body>
<div class="email-wrapper">
    <div class="container">
        <div class="header"><h2>Email Verification</h2></div>
        <div class="content">
            <p>Hello <span class="highlight-user">{user_name}</span>,</p>
            <p>Thank you for registering with <span class="highlight-wv">Waste Vision</span>. Please use the verification code below to verify your email:</p>
            <div class="code">{verification_code}</div>
            <p><strong>Note:</strong> This code will remain valid for <strong>1 hour</strong>.</p>
            <p>If you did not request this verification, you may safely ignore this email.</p>
            <div class="brand-line">At Waste Vision, we take security seriously as we continue to build sustainable and innovative solutions for the future 🌱</div>
        </div>
        <div class="footer">&copy; 2025 <span class="highlight-wv">Waste Vision</span> — Redefining Waste, Restoring the Planet 🌎</div>
    </div>
</div>
</body>
</html>
"""
    return send_email(to_email, subject, html_content)


def send_password_reset_email(to_email: str, reset_code: str, user_name: str) -> bool:
    subject = "Password Reset - Waste Vision"
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Waste Vision - Password Reset</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap');
body {{
    font-family: 'Inter', Arial, sans-serif;
    background: #eef5ef;
    margin: 0;
    padding: 0;
    color: #26332a;
    font-weight: 600;
}}
.email-wrapper {{
    width: 100%;
    padding: 30px 0;
    background: #eef5ef;
}}
.container {{
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 6px 22px rgba(0,0,0,0.1);
    border: 1px solid #c7e1cf;
}}
.header {{
    background: linear-gradient(135deg, #7ab159, #7ab159);
    color: #fff;
    text-align: center;
    padding: 35px 20px;
}}
.header h2 {{
    margin: 0;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: 0.6px;
}}
.content {{
    padding: 30px 25px;
    line-height: 1.8;
    font-size: 16px;
    color: #2b3a30;
}}
.content p {{
    margin: 18px 0;
}}
.code {{
    display: block;
    font-size: 26px;
    font-weight: 800;
    background: #e8f5e9;
    color: #679e4f;
    padding: 18px;
    margin: 28px 0;
    border-radius: 12px;
    text-align: center;
    letter-spacing: 4px;
    border: 1px solid #679e4f;
    box-shadow: inset 0 2px 5px rgba(103, 158, 79, 0.12);
}}
.brand-line {{
    margin-top: 28px;
    padding: 18px 20px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    color: #000000;
    background: #f1faf2;
    border-radius: 10px;
    border: 1px solid #679e4f;
}}
.footer {{
    padding: 22px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #4d5c54;
    background-color: #eef5ef;
    border-top: 1px solid #c7e1cf;
}}
.highlight-user {{ color: #000000; font-weight: 800; }}
.highlight-wv {{ color: #000000; font-weight: 800; }}
@media screen and (max-width: 640px) {{
    .container {{ width: 92% !important; }}
    .header h2 {{ font-size: 22px !important; }}
    .code {{ font-size: 22px !important; padding: 14px !important; }}
    .content {{ font-size: 15px !important; }}
    .brand-line {{ font-size: 15px !important; }}
}}
</style>
</head>
<body>
<div class="email-wrapper">
    <div class="container">
        <div class="header"><h2>Password Reset Request</h2></div>
        <div class="content">
            <p>Hello <span class="highlight-user">{user_name}</span>,</p>
            <p>We received a request to reset your password for your <span class="highlight-wv">Waste Vision</span> account. Please use the code below:</p>
            <div class="code">{reset_code}</div>
            <p><strong>Note:</strong> This code will remain valid for <strong>1 hour</strong>. After that, you’ll need to generate a new one.</p>
            <p>If you did not request this reset, simply ignore this email — your account is safe.</p>
            <div class="brand-line">At Waste Vision, we take security seriously as we continue to build sustainable and innovative solutions for the future 🌱</div>
        </div>
        <div class="footer">&copy; 2025 <span class="highlight-wv">Waste Vision</span> — Redefining Waste, Restoring the Planet 🌎</div>
    </div>
</div>
</body>
</html>
"""
    return send_email(to_email, subject, html_content)
