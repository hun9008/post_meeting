import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signUp.scss';
import Policy from './aggree';

function SignUp() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nickname, setNickname] = useState('');
    const [emailSent, setEmailSent] = useState(false); 
    const [isVerified, setIsVerified] = useState(false); 
    const [sex, setSex] = useState('male');
    const [isAggreed, setIsAggreed] = useState(false);  // [TODO] 개인정보처리방침 동의
    const navigate = useNavigate();
    const [showPolicy, setShowPolicy] = useState(false);  // 개인정보처리방침 보여주기
    const url = 'http://localhost:8000';

    const isUserIdValid = userId.endsWith('@ajou.ac.kr');
    const isPasswordValid = password.length >= 8;
    const isPasswordConfirmValid = password === passwordConfirm;
    const isNicknameValid = nickname.trim() !== '';
    const isFormValid = isUserIdValid && isPasswordValid && isPasswordConfirmValid && isNicknameValid && isVerified && isAggreed;

    const handleToggleSex = () => {
        setSex(sex === 'male' ? 'female' : 'male');
    };

    const handleSubmit = (e) => {
        const endpoint = '/api/auth/register/final';
        const payload = {
            email: userId,  // Using the studentNumber state
            password: password,
            name: nickname,
            sex: sex
        };
        e.preventDefault();

        axios.post(url + endpoint, payload)
            .then(response => {
                console.log(response);
                navigate('/');
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    const handleEmailSend = () => {
        const endpoint = '/api/auth/register/email'
        const payload = {
            email: userId
        };

        axios.post(url + endpoint, payload)
            .then(response => {
                console.log(response);
                setEmailSent(true);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    const handleEmailCheck = () => {
        const endpoint = '/api/auth/register/vaildcheck'
        const payload = {
            email: userId
        };

        axios.post(url + endpoint, payload)
            .then(response => {
                console.log(response);
                setIsVerified(true);
                alert('인증되었습니다!');
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    const handleBackButton = () => {
        navigate('/');
    }

    const handleOpenPolicy = () => {
        setShowPolicy(true);
    }

    const handleCloseAggree = () => {
        setShowPolicy(false);
        setIsAggreed(true);
    }

    return (
        <div>
            <form className='signUp' onSubmit={handleSubmit}>
                <button className='back-button' onClick={handleBackButton}>
                    {'<'}
                </button>
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
                {emailSent && (
                    <button type="button" onClick={handleEmailCheck} style={{marginTop:0, marginBottom:10, marginLeft:-5}}>
                        인증확인
                    </button>
                )}
                {/* <button type="button" onClick={handleEmailCheck} style={{marginTop:0, marginBottom:10, marginLeft:-10}}>
                    인증확인
                </button> */}
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
                <div>
                    <label>
                        성별
                        <br/>
                        <div className="toggle-switch" style={{marginTop:5}}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={sex === 'female'} 
                                    onChange={handleToggleSex} 
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </label>
                </div>
                <br/>
                {/* 개인정보처리방침 동의 */}
                <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center', overflow: 'hidden'}}>
                    <input
                        type="checkbox"
                        checked={isAggreed}
                        onChange={(e) => setIsAggreed(e.target.checked)}
                    />
                    <div>
                        <button type="button" onClick={handleOpenPolicy} 
                         style={{background: 'none', border: 'none', color: 'black', textDecoration: 'underline'}}
                        >개인정보처리방침 동의</button> 
                    </div>
                </div>
                <button type="submit" disabled={!isFormValid}>
                    제출
                </button>
            </form>
            <div>
                {showPolicy && <Policy onClose={handleCloseAggree}/>}
            </div>
        </div>
    );
}

export default SignUp;
