from domain.email.send_email import send_email_async,send_email_background
from fastapi import BackgroundTasks
import asyncio

# async def main():
#   await send_email_async('hello','sdfg8931@ajou.ac.kr',{'title':'hello','name':'sehyun'})

if __name__ == '__main__':
  # asyncio.run(main())
  send_email_background(BackgroundTasks(),'hello','sdfg8931@ajou.ac.kr',{'title':'hello','name':'sehyun'})
