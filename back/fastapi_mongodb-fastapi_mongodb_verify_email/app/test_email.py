from .email import Email
import asyncio

# async def main():
#   await send_email_async('hello','sdfg8931@ajou.ac.kr',{'title':'hello','name':'sehyun'})

if __name__ == '__main__':
  # asyncio.run(main())
  asyncio.run(Email({'name':'sehyun'},'sdff',['sdfg8931@ajou.ac.kr']).sendVerificationCode())
