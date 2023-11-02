import React, { useState } from 'react';

function Subpage({ onAdd, onCancel }) {
  const [MBTI, setMBTI] = useState('');
  const [hobby, setHobby] = useState('');
  const [instaId, setInstaId] = useState('');

  return (
    <div className="subpage-container">
      <textarea 
        className="postit-input" 
        placeholder="MBTI를 입력해주세요..." 
        value={MBTI} 
        onChange={e => setMBTI(e.target.value)}
      />
      <textarea 
        className="postit-input" 
        placeholder="취미를 입력해주세요..." 
        value={hobby} 
        onChange={e => setHobby(e.target.value)}
      />
      <textarea 
        className="postit-input" 
        placeholder="인스타아이디를 입력해주세요..." 
        value={instaId} 
        onChange={e => setInstaId(e.target.value)}
      />
      <button className="sub_button" onClick={() => onAdd(`${MBTI}\n${hobby}\n${instaId}`)} style={{marginRight:5}}>완료</button>
      <button className="sub_button" onClick={onCancel} style={{marginLeft: 5}}>취소</button>
    </div>
  );
}

export default Subpage;
