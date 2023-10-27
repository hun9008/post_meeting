import React, { useState, useEffect } from 'react';
import './App.css';
import Subpage from './sub_page'; 

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
  const newPostit = {
      id: new Date().getTime(),
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2 - 100,
      content: text
    };
    setPostits([...postits, newPostit]);
    setShowSubpage(false);
  };

  const handleDragStart = (e, id) => {
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
          className="postit" 
          style={{ left: postit.x, top: postit.y }}
          onMouseDown={e => handleDragStart(e, postit.id)}
        >
          {postit.content}
        </div>
      ))}
      <button className="add-button" onClick={handleOpenSubpage}>+</button>
    </div>
  );
}

export default App;


