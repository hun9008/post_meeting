// src/LoginPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './monitor.scss';

function LoginPage() {
    const [password, setPassword] = useState('');
    const [showMonitor, setShowMonitor] = useState(false);  // 개인정보처리방침 보여주기
    const navigate = useNavigate();
    const url = process.env.REACT_APP_SERVER_API;
    const pw = process.env.REACT_APP_MONITOR_PW;
    const [user, setUser] = useState([]);
    
    useEffect(() => {  // 컴포넌트가 마운트될 때 화면을 최상단 최좌측으로 이동시킵니다.
      window.scrollTo(0, 0);
    }, []); 

    const handleSubmitClick = (e) => {
        if(password === pw){
            const endpoint = '/api/users/all';

            e.preventDefault();

            axios.get(url + endpoint)
                .then(response => {
                    // console.log('response : ',response);
                    setUser(response.data.user);
                    setShowMonitor(true);
                    // console.log('user : ',user);
                })
                .catch(error => {
                    alert('유저 데이터를 가져오는 데 실패했습니다:', error);
                });
        } else{
            alert('관리자 번호가 틀렸습니다.');
        }
    };


    return (
      <div>
        { showMonitor && user !== undefined &&
            (<div className="monitor-container">
                <button className='back-button' onClick={() => setShowMonitor(false)}>
                    {'Close'}
                </button>
                <h1>Monitoring Page</h1>
                <div>
                    <p>Total Users: {user.length}</p>
                    <p>Male Users: {user.filter(user => user.postit?.sex === 'male').length}</p>
                    <p>Female Users: {user.filter(user => user.postit?.sex === 'female').length}</p>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>MBTI</th>
                        <th>Hobby</th>
                        <th>Emoji</th>
                        <th>Height</th>
                        <th>Military Service</th>
                        <th>Body Type</th>
                        <th>Eyelid</th>
                        <th>Fashion</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Verified</th>
                    </tr>
                    </thead>
                    <tbody>
                    {user.map((user, index) => (
                        <tr key={index}>
                            <td>{user.email || ''}</td>
                            <td>{user.postit?.mbti || ''}</td>
                            <td>{user.postit?.hobby ? user.postit.hobby.join(", ") : ''}</td>
                            <td>{user.postit?.emogi || ''}</td>
                            <td>{user.postit?.height || ''}</td>
                            <td>{user.postit?.militaryService ? user.postit.militaryService.toString() : ''}</td>
                            <td>{user.postit?.bodyType || ''}</td>
                            <td>{user.postit?.eyelid ? user.postit.eyelid.toString() : ''}</td>
                            <td>{user.postit?.fashion ? user.postit.fashion.join(", ") : ''}</td>
                            <td>{user.created_at || ''}</td>
                            <td>{user.updated_at || ''}</td>
                            <td>{user.verified ? user.verified.toString() : ''}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>)}
        <div>
        <form className="login" onSubmit={handleSubmitClick}>
          <div>
            <h2>Monitoring</h2>
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
          <button type="submit" onClick={handleSubmitClick} style={{marginRight: 5}}>Enter</button>
        </form>
        </div>
      </div>
    );
}

export default LoginPage;