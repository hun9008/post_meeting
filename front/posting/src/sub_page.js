import React, { useState } from 'react';

function Subpage({ onAdd, onCancel }) {
  const [MBTI, setMBTI] = useState('');
  const [hobby, setHobby] = useState('');
  const [instaId, setInstaId] = useState('');
  const [freeForm, setFreeForm] = useState('');
  const [form, setForm] = useState('suggest');

  const handleToggleSex = () => {
    setForm(form === 'suggest' ? 'free' : 'suggest');
  };

  const renderTextAreas = () => {
    if (form === 'suggest') {
      return (
        <>
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
        </>
      );
    } else {
      return (
        <textarea 
          className="postit-input-free" 
          placeholder="내용을 자유롭게 입력해주세요..." 
          value={freeForm} 
          onChange={e => setFreeForm(e.target.value)}
        />
      );
    }
  };

  return (
    <div className="subpage-container">
      <div className="toggle-switch" style={{marginTop:5}}>
        <label>
          <input 
            type="checkbox" 
            checked={form === 'free'} 
            onChange={handleToggleSex} 
          />
          <span className="slider"></span>
        </label>
      </div>
      {renderTextAreas()}
      <button className="sub_button" onClick={() => onAdd(`${MBTI}\n${hobby}\n${instaId}\n${freeForm}`)} style={{marginRight:5}}>완료</button>
      <button className="sub_button" onClick={onCancel} style={{marginLeft: 5}}>취소</button>
    </div>
  );
}

export default Subpage;

