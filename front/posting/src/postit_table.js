import React, { useState, useEffect } from 'react';
import './App.css';
import Subpage from './sub_page'; 
import './sub_page.scss';

function App() {
    const [postits, setPostits] = useState([]);

    // 페이지 로드 시 localStorage에서 포스트잇 상태 불러오기
    useEffect(() => {
        const savedPostits = localStorage.getItem('postits');
        if (savedPostits) {
        setPostits(JSON.parse(savedPostits));
        }
    }, []);

    useEffect(() => {
        // 포스트잇 상태가 변경될 때마다 localStorage에 저장하기
        localStorage.setItem('postits', JSON.stringify(postits));
    }, [postits]);

    const [showSubpage, setShowSubpage] = useState(false);

    const handleOpenSubpage = () => {
        setShowSubpage(true);
    };

    const handleAddPostitFromSubpage = (text) => {
        const [mbtiValue, hobbyValue, instaIdValue] = text.split('\n');
        const randomX = Math.random() * (window.innerWidth - 1000); // 포스트잇 너비를 고려
        const randomY = Math.random() * (window.innerHeight - 170); // 포스트잇 높이를 고려

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
        const offsetX = e.clientX - postit.x;
        const offsetY = e.clientY - postit.y;

        const onDrag = (event) => {
        postit.x = event.clientX - offsetX;
        postit.y = event.clientY - offsetY;
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
        </div>
    );
}

export default App;

