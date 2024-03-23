import React, { useState } from 'react';
import './myDeleteCheck.scss';

function myDeleteCheck({ sex, onCancel, onDelete }) {

  return (
    <div className={`subpage-container ${sex}`}>

        <h2>정말 삭제하시겠습니까?</h2>
        <p>아래 <span style={{color: 'red', fontWeight: 'bold'}}>삭제</span>버튼을 누르면 삭제가 되며,</p>
        <p><span style={{color: 'red', fontWeight: 'bold'}}>삭제</span>된 정보는 복구할 수 없습니다.</p>
        <button className={`sub_button ${sex}`} onClick={onCancel} style={{marginLeft: 5}}>취소</button>
        <button className={`sub_button ${sex}`} onClick={onDelete}>삭제</button>
    </div>
  );
}

export default myDeleteCheck;

