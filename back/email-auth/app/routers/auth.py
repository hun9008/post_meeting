

@router.post('/register', status_code=status.HTTP_201_CREATED)
async def create_user(payload: schemas.CreateUserSchema, request: Request):
    # Check if user already exist
    user = User.find_one({'email': payload.email.lower()})
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='Account already exist')
    # Compare password and passwordConfirm
    if payload.password != payload.passwordConfirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail='Passwords do not match')
    #  Hash the password
    payload.password = utils.hash_password(payload.password)
    del payload.passwordConfirm
    payload.role = 'user'
    payload.verified = False
    payload.email = payload.email.lower()
    payload.created_at = datetime.utcnow()
    payload.updated_at = payload.created_at

    result = User.insert_one(payload.dict())
    new_user = User.find_one({'_id': result.inserted_id})
    try:
        token = randbytes(10)
        hashedCode = hashlib.sha256()
        hashedCode.update(token)
        verification_code = hashedCode.hexdigest()
        User.find_one_and_update({"_id": result.inserted_id}, {
            "$set": {"verification_code": verification_code, "updated_at": datetime.utcnow()}})

        url = f"{request.url.scheme}://{request.client.host}:{request.url.port}/api/auth/verifyemail/{token.hex()}"
        await Email(userEntity(new_user), url, [EmailStr(payload.email)]).sendVerificationCode()
    except Exception as error:
        User.find_one_and_update({"_id": result.inserted_id}, {
            "$set": {"verification_code": None, "updated_at": datetime.utcnow()}})
        print(error)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f'There was an error sending email {error}')

    return {'status': 'success', 'message': 'Verification token successfully sent to your email'}

@router.get('/verifyemail/{token}')
def verify_me(token: str):
    hashedCode = hashlib.sha256()
    hashedCode.update(bytes.fromhex(token))
    verification_code = hashedCode.hexdigest()
    result = User.find_one_and_update({"verification_code": verification_code}, {
        "$set": {"verification_code": None, "verified": True, "updated_at": datetime.utcnow()}}, new=True)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail='Invalid verification code or account already verified')
    return {
        "status": "success",
        "message": "Account verified successfully"
    }
