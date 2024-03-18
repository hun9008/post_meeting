// src/LoginPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menual from './howToUse'
import './login.scss';

function LoginPage() {
    const [user_id, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showMenual, setShowMenual] = useState(false);  // 개인정보처리방침 보여주기
    const navigate = useNavigate();
    // const url = 'https://3.27.141.88' 
    // const url = 'https://p7219.site'
    const url = process.env.REACT_APP_SERVER_API;

    useEffect(() => {  // 컴포넌트가 마운트될 때 화면을 최상단 최좌측으로 이동시킵니다.
      window.scrollTo(0, 0);
    }, []);

    const moveToSignUp = () => {
        navigate('/SignUp');
    }

    const moveToFindPw = () => { 
        navigate('/FindPw');
    }

    

    const handleSubmitClick = (e) => {
        const endpoint = '/api/auth/login';

        const payload = {
            email: user_id,  // Using the studentNumber state
            password: password
        };

        // navigate('/PostitTable');
        e.preventDefault();

        axios.post(url + endpoint, payload)
            .then(response => {
                console.log(response);
                localStorage.setItem('sex', response.data.sex);
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                localStorage.setItem('user_id', response.data.user_id);
                navigate('/PostitTable');
            })
            //400인 error만 catch
            .catch(error => {
                console.error("Error fetching data:", error);
                if (error.response.status === 400) {
                    alert(`${error.response.data.detail}`);
                } else if (error.response.status === 500) {
                  alert('500 Error');
                }
                else {
                    alert('로그인에 실패했습니다.(undefined error)');
                }
            });
    };

    const handleMenualOpen = () => {
      setShowMenual(true);
    }

    const handleMenualClose = () => {
      setShowMenual(false);
    }

    return (
      <div>
        <form className="login" onSubmit={handleSubmitClick}>
          <div>
            <button type="button" onClick={handleMenualOpen}>?</button>
            <h2>Login</h2>
          </div>
          <div>
            <label>
              <input
                type="text"
                placeholder="Username"
                value={user_id}
                onChange={(e) => setUserId(e.target.value)}
              />
            </label>
          </div>
          <br/>
          <div>
            <label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <br/>
          <button type="submit" onClick={handleSubmitClick} style={{marginRight: 5}}>Login</button>
          <button onClick={moveToSignUp} style={{marginLeft: 5, marginRight: 5}}>SignUp</button>
          <button onClick={moveToFindPw} style={{marginLeft: 5}}>Find PW</button>
        </form>
        <div>
          {showMenual && <Menual onClose={handleMenualClose} />}
        </div>
      </div>
    );
}

export default LoginPage;