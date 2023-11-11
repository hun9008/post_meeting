// src/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.scss';

function LoginPage() {
    const [user_id, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const url = 'https://701e-118-34-163-168.ngrok-free.app' 

    const moveToSignUp = () => {
        navigate('/SignUp');
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
                // localStorage.setItem('nickname', response.data.nickname);
                localStorage.setItem('token', response.data.access_token);
                navigate('/PostitTable');
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    return (
      <div>
        {/* <h2>Login</h2> */}
        <form className="login" onSubmit={handleSubmitClick}>
            <h2>Login</h2>
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
          <button onClick={moveToSignUp} style={{marginLeft: 5}}>SignUp</button>
        </form>
      </div>
    );
}

export default LoginPage;
