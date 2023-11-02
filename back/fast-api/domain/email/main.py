import smtplib, ssl

SMTP_SSL_PORT=465 # SSL connection
SMTP_SERVER="smtp.gmail.com"

SENDER_EMAIL="sdfg8931@gmail.com"
SENDER_PASSWORD="owzw ijai bbgn dfsa"

RECEIVER_EMAIL="sdfg8931@ajou.ac.kr"

context = ssl.create_default_context()

with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_SSL_PORT, context=context) as server:
    server.login(SENDER_EMAIL, SENDER_PASSWORD)
    server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, "sending SMTP email test")
print('mail sending is complete')