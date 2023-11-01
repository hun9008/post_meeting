import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signUp.scss';

function SignUp() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const isUserIdValid = userId.endsWith('@ajou.ac.kr');
    const isPasswordValid = password.length >= 8;
    const isPasswordConfirmValid = password === passwordConfirm;
    const isNicknameValid = nickname.trim() !== '';
    const isFormValid = isUserIdValid && isPasswordValid && isPasswordConfirmValid && isNicknameValid;

    const handleSubmit = (e) => {
        const url = "...";
        const payload = {
            id: userId,  // Using the studentNumber state
            pw: password,
            nickname: nickname
        };
        e.preventDefault();

        localStorage.setItem('id', JSON.stringify(userId));
        localStorage.setItem('pw', JSON.stringify(password));
        localStorage.setItem('nickname', JSON.stringify(nickname));

        alert('회원가입 완료!');
        navigate('/');
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
