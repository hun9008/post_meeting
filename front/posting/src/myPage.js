import React, { useState } from 'react';
import './myPage.scss';
import {EditOutlined} from '@ant-design/icons';

function Mypage({postit, onCancel, onLogout, onShowEdit}) {

    const getEmogi = (emogi) => {
        if (emogi === 1) {
            return 'cat';
        } else if (emogi === 2) {
            return 'dog';
        } else if (emogi === 3) {
            return 'fox';
        } else if (emogi === 4) {
            return 'hamster';
        } else if (emogi === 5) {
            return 'horse';
        } else if (emogi === 6) {
            return 'lion';
        } else if (emogi === 7) {
            return 'monkey';
        } else if (emogi === 8) {
            return 'panda';
        } else if (emogi === 9) {
            return 'rabbit';
        } else if (emogi === 10) {
            return 't-rex';
        } else if (emogi === 11) {
            return 'tiger';
        }
    }

    const isMale = postit.sex === "male" ? true : false;

    return (
        <div className={`mypage-container ${postit.sex}`}>
            <div className="myHeader">
                <img src={process.env.PUBLIC_URL + `/emoji_png/${getEmogi(postit.emogi)}.png`} alt="Emogi" style={{ width: '60px', height: '60px' }} />    
                <div>
                    <h2 style={{marginLeft: "10px"}}>{postit.name}'s INFO</h2>
                </div>
                <div>
                    <button className={`edit-button ${postit.sex}`} onClick={onShowEdit}><EditOutlined/></button> 
                </div>
            </div>
            <div className="myBody">
                {isMale && (
                    <div>
                        <div className="infoBox">
                            <div className="infoTitle" variant="ghost">
                                군필여부
                            </div>
                            <div className="infoContent">
                                <div className={`infoItem ${postit.sex}`}>
                                    {postit.militaryService ? "군필" : "미필"}
                                </div>
                            </div>
                        </div>

                        <div className="infoBox">
                            <div className="infoTitle" variant="ghost">
                                키
                            </div>
                            <div className="infoContent">
                                <div className={`infoItem ${postit.sex}`}>
                                    {postit.height}cm
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                    <div className="infoBox">    
                        <div className="infoTitle" variant="ghost">
                            MBTI
                        </div>
                        <div className="infoContent">
                            <div className={`infoItem ${postit.sex}`}>
                                {postit.mbti}
                            </div>
                        </div>
                    </div>

                    <div className="infoBox">    
                        <div className="infoTitle" variant="ghost">
                            취미
                        </div>
                        <div className="infoContent">

                            {postit.hobby.map((item, index) => (
                                <div key={index} className={`infoItem ${postit.sex}`}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="infoBox">    
                        <div className="infoTitle" variant="ghost">
                            쌍꺼풀
                        </div>
                        <div className="infoContent">
                            <div className={`infoItem ${postit.sex}`}>
                                {postit.eyelid ? "유쌍" : "무쌍"}
                            </div>
                        </div>
                    </div>

                    <div className="infoBox">    
                        <div className="infoTitle" variant="ghost">
                            패션 스타일
                        </div>
                        <div className="infoContent">
                            {postit.fashion.map((item, index) => (
                                <div key={index} className={`infoItem ${postit.sex}`}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="infoBox">
                        <div className="infoTitle" variant="ghost">
                            체형
                        </div>
                        <div className="infoContent">
                            <div className={`infoItem ${postit.sex}`}>
                                {postit.bodyType}
                            </div>
                        </div>
                    </div>
            </div>
            <br/>
        
            <div>
                <button className={`my_button ${postit.sex}`} onClick={onCancel} style={{marginRight: 5}}>Back</button>
                <button className={`my_button ${postit.sex}`} onClick={onLogout}>Logout</button>
                <button className={`my_button ${postit.sex}`} style={{marginLeft: 5}}>Delete</button>
            </div>
        </div>
    );
}

export default Mypage;