import React, { useState, useEffect } from 'react';
import './App.css';
import Subpage from './sub_page'; 
import './sub_page.scss';
import axios from 'axios';

function App() {
    const [postits, setPostits] = useState([]);
    const [showSubpage, setShowSubpage] = useState(false);
    const [viewport, setViewport] = useState({ x: 0, y: 0, width: 100, height: 100 });
    const url = 'https://701e-118-34-163-168.ngrok-free.app'; 

    useEffect(() => {
        const endpoint = '/api/postit/all';
        const access_token = localStorage.getItem('token');

        const headers = {
            'Content-Type': `application/json`,
            'ngrok-skip-browser-warning': '69420',
            Authorization: `Bearer ${access_token}` // 'Bearer'는 일반적인 인증 스킴입니다.
        };

        axios.get(url + endpoint, { headers })
            .then(response => {
                // 배열인지 확인하고, 배열이면 상태를 업데이트합니다.
                if (Array.isArray(response.data.postits)) {
                    setPostits(response.data.postits);
                } else {
                    console.error('받아온 데이터가 배열이 아닙니다:', response.data);
                    // 추가적인 에러 핸들링 로직
                }
            })
            .catch(error => {
                console.error('포스트잇 데이터를 가져오는 데 실패했습니다:', error);
            });
    }, []);

    useEffect(() => {
        const endpoint = '/postit/make'
        const access_token = localStorage.getItem('token');
        const payload = {
            name: 'hun',
            email: 'younghune135@ajou.ac.kr',
            role: 'student',
            // postit: {postits},
            postit: postits[0],
            created_at: "2023-11-04T16:36:44.295Z",
            updated_at: "2023-11-04T16:36:44.295Z"
        };

        const headers = {
            Authorization: `Bearer ${access_token}` // 'Bearer'는 일반적인 인증 스킴입니다.
        };

        if (postits.length > 0 && access_token) {
            axios.post(url + endpoint, payload, { headers })
                 .then(response => {
                     console.log(response);
                 })
                 .catch(error => {
                     console.error('서버에 포스트잇 상태를 저장하는 데 실패했습니다:', error);
                 });
        }
    }, [postits]);

    const handleOpenSubpage = () => {
        setShowSubpage(true);
    };

    const handleAddPostitFromSubpage = (text) => {
        const [mbtiValue, hobbyValue, instaIdValue] = text.split('\n');
        const documentWidth = document.documentElement.scrollWidth;
        const documentHeight = document.documentElement.scrollHeight;

        const randomX = Math.random() * (documentWidth - 1000); // 포스트잇 너비를 고려
        const randomY = Math.random() * (documentHeight - 170); // 포스트잇 높이를 고려

        const newPostit = {
            id: new Date().getTime(),
            x: window.scrollX + randomX,
            y: window.scrollY + randomY,
            content_mbti: mbtiValue,
            content_hobby: hobbyValue,
            content_insta: instaIdValue,
        };
        setPostits([...postits, newPostit]);
        setShowSubpage(false);
    };

    const handleDragStart = (e, id) => {
        e.preventDefault();
        const postit = postits.find(p => p.id === id);
        const documentWidth = document.documentElement.scrollWidth;
        const documentHeight = document.documentElement.scrollHeight;
        const offsetX = e.clientX - (postit.x / documentWidth) * window.innerWidth;
        const offsetY = e.clientY - (postit.y / documentHeight) * window.innerHeight;

        const onDrag = (event) => {
            const newPosX = (event.clientX - offsetX) / window.innerWidth * documentWidth;
            const newPosY = (event.clientY - offsetY) / window.innerHeight * documentHeight;
            postit.x = newPosX;
            postit.y = newPosY;
            setPostits([...postits]);
        };

        const onDragEnd = () => {
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', onDragEnd);
        };

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', onDragEnd);
    };

    const handleDeletePostit = (id) => {
        const updatedPostits = postits.filter(postit => postit.id !== id);
        setPostits(updatedPostits);
    };

    useEffect(() => {
        const handleScroll = () => {
          // 스크롤에 따라 뷰포트 정보를 업데이트
          const viewportWidth = (window.innerWidth / document.documentElement.scrollWidth) * 100;
          const viewportHeight = (window.innerHeight / document.documentElement.scrollHeight) * 100;
          const viewportX = (window.scrollX / document.documentElement.scrollWidth) * 100;
          const viewportY = (window.scrollY / document.documentElement.scrollHeight) * 100;
    
          setViewport({ x: viewportX, y: viewportY, width: viewportWidth, height: viewportHeight });
        };
    
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // 초기 뷰포트 위치 설정
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const renderPostitPoints = () => {
        return postits.map((postit, index) => {
          const style = {
            position: 'absolute',
            left: `${(postit.x / document.documentElement.scrollWidth) * 100}%`,
            top: `${(postit.y / document.documentElement.scrollHeight) * 100}%`,
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: 'red'
          };
          return <div key={index} style={style}></div>;
        });
      };


    return (
        <div className="App">
        {showSubpage && 
            <Subpage 
            onAdd={handleAddPostitFromSubpage} 
            onCancel={() => setShowSubpage(false)}
            />
        } 
        {postits.map(postit => (
            <div 
            key={postit.id} 
            className="rgyPostIt" 
            style={{ left: postit.x, top: postit.y}}
            onMouseDown={e => handleDragStart(e, postit.id)}
            >
                <button className="close-button" onClick={() => handleDeletePostit(postit.id)}>X</button>
                {postit.content_mbti}<br/>
                {postit.content_hobby}<br/>
                {postit.content_insta}<br/>
            </div>
        ))}
        <button className="add-button" onClick={handleOpenSubpage}>+</button>
        <div className="minimap" style={{ position: 'fixed', bottom: 0, left: 0, width: '150px', height: '150px', backgroundColor: 'rgba(0, 0, 0, 0.3)', overflow: 'hidden' }}>
            {renderPostitPoints()}
            <div style={{ position: 'absolute', left: `${viewport.x}%`, top: `${viewport.y}%`, width: `${viewport.width}%`, height: `${viewport.height}%`, border: '2px solid red' }}></div>
        </div>
        </div>
    );
}

export default App;

