import os
from email.message import EmailMessage
import ssl
import smtplib

def send_email(to_email, subject, body):
    email_sender = os.environ['EMAIL_SENDER']
    password = os.environ['EMAIL_PASSWORD']
    
    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = to_email
    em['Subject'] = subject
    em.set_content(body)
    
    context = ssl.create_default_context()
    
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(email_sender, password)
        smtp.sendmail(email_sender, to_email, em.as_string())
