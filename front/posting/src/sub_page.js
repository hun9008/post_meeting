import React, { useState } from 'react';

function Subpage({ onAdd, onCancel }) {
  const [text, setText] = useState('');

  return (
    <div className="subpage-container">
      <textarea 
        className="postit-input" 
        placeholder="포스트잇 내용을 입력하세요..." 
        value={text} 
        onChange={e => setText(e.target.value)}
      />
      <button className="complete-button" onClick={() => onAdd(text)}>완료</button>
      <button className="cancel-button" onClick={onCancel}>취소</button>
    </div>
  );
}

export default Subpage;
