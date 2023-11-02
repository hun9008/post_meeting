import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signUp.scss';

function SignUp() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nickname, setNickname] = useState('');
    const [emailSent, setEmailSent] = useState(false); 
    const [isVerified, setIsVerified] = useState(false); 
    const navigate = useNavigate();

    const isUserIdValid = userId.endsWith('@ajou.ac.kr');
    const isPasswordValid = password.length >= 8;
    const isPasswordConfirmValid = password === passwordConfirm;
    const isNicknameValid = nickname.trim() !== '';
    const isFormValid = isUserIdValid && isPasswordValid && isPasswordConfirmValid && isNicknameValid && isVerified;

    const handleSubmit = (e) => {
        const url = "https://3ea7-210-107-197-58.ngrok-free.app/api/auth/register/final";
        const payload = {
            email: userId,  // Using the studentNumber state
            password: password,
            name: nickname
        };
        e.preventDefault();

        // localStorage.setItem('id', JSON.stringify(userId));
        // localStorage.setItem('pw', JSON.stringify(password));
        // localStorage.setItem('nickname', JSON.stringify(nickname));

        axios.post(url, payload)
            .then(response => {
                console.log(response);
                navigate('/');
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    const handleEmailSend = () => {
        const url = "https://3ea7-210-107-197-58.ngrok-free.app/api/auth/register/email";
        const payload = {
            email: userId
        };

        axios.post(url, payload)
            .then(response => {
                console.log(response);
                setEmailSent(true);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    const handleEmailCheck = () => {
        const url = "https://3ea7-210-107-197-58.ngrok-free.app/api/auth/register/vaildcheck";
        const payload = {
            email: userId
        };

        axios.post(url, payload)
            .then(response => {
                console.log(response);
                setIsVerified(true);
                alert('인증되었습니다!');
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    return (
        <div>
            <form className='signUp' onSubmit={handleSubmit}>
                <h2>회원가입</h2>
                <div>
                    <label>
                        아이디
                        <input
                            type="email"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="something@ajou.ac.kr"
                        />
                    </label>
                </div>
                <button type="button" onClick={handleEmailSend} style={{marginTop:0, marginBottom:10}}>
                    메일전송
                </button>
                {emailSent && ( // This button will only appear if emailSent is true
                    <button type="button" onClick={handleEmailCheck} style={{marginTop:0, marginBottom:10, marginLeft:-5}}>
                        인증확인
                    </button>
                )}
                <div>
                    <label>
                        비밀번호
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="8자 이상 입력해주세요."
                        />
                    </label>
                </div>
                <div>
                    <label>
                        비밀번호 확인
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="8자 이상 입력해주세요."
                        />
                    </label>
                </div>
                <div>
                    <label>
                        닉네임
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="닉네임을 입력해주세요."
                        />
                    </label>
                </div>
                <button type="submit" disabled={!isFormValid}>
                    제출
                </button>
            </form>
        </div>
    );
}

export default SignUp;
