// src/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signUp.scss';

function FindPwPage() {
    const [userId, setUserId] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [emailSent, setEmailSent] = useState(false); 
    const [isVerified, setIsVerified] = useState(false); 
    const navigate = useNavigate();
    // const url = 'https://3.27.141.88'
    // const url = 'https://p7219.site' 
    const url = process.env.REACT_APP_SERVER_API;

    const isUserIdValid = userId.endsWith('@ajou.ac.kr');
    const isPasswordValid = newPassword.length >= 8;
    const isPasswordConfirmValid = newPassword === passwordConfirm;
    const isFormValid = isUserIdValid && isPasswordValid && isPasswordConfirmValid && isVerified;

    const handleBackButton = () => {
      navigate('/');
    }

    //should be changed
    const handleSubmitClick = (e) => {
        const endpoint = '/api/auth/find_password';
        const payload = {
            email: userId,  // Using the studentNumber state
            password: newPassword
        };

        e.preventDefault();

        axios.post(url + endpoint, payload)
            .then(response => {
                //console.log(response);
                navigate('/');
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                alert('비밀번호 변경에 실패했습니다.');
            });
    };

    const handleEmailSend = () => {
      const endpoint = '/api/auth/register/email'
      const payload = {
          email: userId
      };

      axios.post(url + endpoint, payload)
          .then(response => {
              //console.log(response);
              setEmailSent(true);
          })
          .catch(error => {
              console.error("Error fetching data:", error);
              //console.log(payload);
          });
    };

    const handleEmailCheck = () => {
      const endpoint = '/api/auth/register/vaildcheck'
      const payload = {
          email: userId
      };

      axios.post(url + endpoint, payload)
          .then(response => {
              //console.log(response);
              setIsVerified(true);
              alert('인증되었습니다!');
          })
          .catch(error => {
              console.error("Error fetching data:", error);
          });
    };

    return (
      <div>
        {/* <h2>Login</h2> */}
        <form className="login" onSubmit={handleSubmitClick}>
            <button className='back-button' onClick={handleBackButton}>
                {'<'}
            </button>
            <h2>비밀번호 재설정</h2>
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
            <br/>
            <div>
                <label>
                    새 비밀번호
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="8자 이상 입력해주세요."
                    />
                </label>
            </div>
            <div>
                <label>
                    새 비밀번호 확인
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="8자 이상 입력해주세요."
                    />
                </label>
            </div>
          <br/>
          <button type="submit" disabled={!isFormValid} onClick={handleSubmitClick} style={{marginRight: 5}}>변경</button>
        </form>
      </div>
    );
}

export default FindPwPage;
