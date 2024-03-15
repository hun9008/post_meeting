import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signUp.scss';

function SignUp_page1({handleNextPage, onSubmit}) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nickname, setNickname] = useState('');
    const [emailSent, setEmailSent] = useState(false); 
    const [isVerified, setIsVerified] = useState(false); 
    const [sex, setSex] = useState('male');
    const navigate = useNavigate();
    const [emailButtonClicked, setEmailButtonClicked] = useState(false);
    const url = process.env.REACT_APP_SERVER_API;    

    const isUserIdValid = userId.endsWith('@ajou.ac.kr');
    const isPasswordValid = password.length >= 8;
    const isPasswordConfirmValid = password === passwordConfirm;
    const isNicknameValid = nickname.trim() !== '';
    // const isFormValid = isUserIdValid && isPasswordValid && isPasswordConfirmValid && isNicknameValid && isVerified;
    const isFormValid = isPasswordValid && isPasswordConfirmValid && isNicknameValid; // test version
    const handleToggleSex = () => {
        setSex(sex === 'male' ? 'female' : 'male');
    };

    const handleEmailSend = () => {
        
        if (!userId.endsWith('@ajou.ac.kr')) {
            alert('이메일 형식이 올바르지 않습니다. @ajou.ac.kr를 이메일을 사용해주세요.');
            return;
        }
        setEmailButtonClicked(true);
        const endpoint = '/api/auth/register/email'
        const payload = {
            email: userId
        };

        axios.post(url + endpoint, payload)
            .then(response => {
                console.log(response);
                setEmailSent(true);
                alert('메일이 전송되었습니다! 인증을 완료해주세요.');
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const page1_data = {
            email: userId,  // Using the studentNumber state
            password: password,
            name: nickname,
            sex: sex
        };
        onSubmit(page1_data);
        handleNextPage();
    };


    const handleBackButton = () => {
        navigate('/');
    }

    return (
        <div>
            <form className='signUp' onSubmit={handleSubmit}>
                <button className='back-button' onClick={handleBackButton}>
                    {'<'}
                </button>
                <h2>회원가입</h2>
                {/* <div>
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
                {!emailButtonClicked && !emailSent && (
                    <button type="button" onClick={handleEmailSend} style={{marginTop:0, marginBottom:10}}>
                        메일전송
                    </button>
                )}
                {emailButtonClicked && !emailSent && (
                    <div style={{marginTop: 0, marginBotton : 10}}>
                        전송중입니다...
                    </div>
                )}
                {emailSent && (
                    
                    <button type="button" onClick={handleEmailCheck} style={{marginTop:0, marginBottom:10, marginLeft:-5}}>
                        인증확인
                    </button>
                )} */}
                <div>
                    <label>
                        비밀번호
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => {
                                if (password.length < 8) {
                                    alert('비밀번호는 8자리 이상 입력해주세요.');
                                }
                            }}
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
                            onBlur={() => {
                                if (password !== passwordConfirm) {
                                    alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
                                }
                            }}
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
                <button type="submit"     
                    onClick={(e) => {
                    if (!isFormValid) {
                        e.preventDefault();
                        alert('폼을 모두 채워주세요.');
                    }
                }}>
                    다음
                </button>
            </form>
        </div>
    );
}

export default SignUp_page1;
