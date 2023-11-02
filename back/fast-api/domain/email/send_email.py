import os
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv
from jinja2 import Environment, FileSystemLoader
import asyncio
load_dotenv()

class Envs:
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_FROM = os.getenv('MAIL_FROM')
    MAIL_PORT = int(os.getenv('MAIL_PORT'))
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_FROM_NAME = os.getenv('MAIN_FROM_NAME')


conf = ConnectionConfig(
    MAIL_USERNAME=Envs.MAIL_USERNAME,
    MAIL_PASSWORD=Envs.MAIL_PASSWORD,
    MAIL_FROM=Envs.MAIL_FROM,
    MAIL_PORT=Envs.MAIL_PORT,
    MAIL_SERVER=Envs.MAIL_SERVER,
    MAIL_FROM_NAME=Envs.MAIL_FROM_NAME,
    MAIL_SSL_TLS =True,
    MAIL_STARTTLS = False,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER='./template'
)


template_dir = "template"
env = Environment(loader=FileSystemLoader(template_dir))

def render_jinja_template(data):
    template_name = "email.html"
    template = env.get_template(template_name)
    rendered_html = template.render(body=data)
    return rendered_html
# 예제 데이터와 스타일을 만듭니다.
# Jinja2 템플릿을 렌더링하고 HTML 문자열을 얻습니다.
# rendered_html = render_jinja_template(data)


async def send_email_async(subject: str, email_to: str, body: dict):
    message = MessageSchema(
        subject=subject,
        subtype='html',
        recipients=[email_to],
        body=render_jinja_template(body),
        template_name='email.html'
    )

    fm = FastMail(conf)
    await fm.send_message(message)

def send_email_background(background_tasks: BackgroundTasks, subject: str, email_to: str, body: dict):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=render_jinja_template(body),
        subtype='html',
        template_name='email.html'
    )
    fm = FastMail(conf)
    background_tasks.add_task(
    asyncio.run(fm.send_message(message)))
    print("success")