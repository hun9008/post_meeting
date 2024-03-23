import React, { useState, useEffect } from 'react';
import './myLikeList.scss';
import axios from 'axios';
import {SearchOutlined} from '@ant-design/icons';
import Subpage from './sub_page';

function LikeList({onCancel, postits, sex, onShowSubpage}) {
    
    const url = process.env.REACT_APP_SERVER_API;
    const [receivedLike, setReceivedLike] = useState([]);

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

    const getLike = () => {
        //보류.
        const endpoint = `/api/like/getlike/${localStorage.getItem('user_id')}`;
        const access_token = localStorage.getItem('token');

        const headers = {
            Authorization: `Bearer ${access_token}` 
        };

        axios.get(url + endpoint, {headers})
            .then(response => {
                // console.log(response);
                setReceivedLike(response.data.recive_like);
                // console.log(receivedLike);
            })
            .catch(error => {
                console.error('좋아요 요청 실패:', error);
            });

    }
    // console.log(`likelist: ${postits}`);

    useEffect(() => {
        getLike();
    }, []);

    // const isMale = postit.sex === "male" ? true : false;

    return (
        <div className={`mylist-container ${sex}`}> 
            <button className={`back-button ${sex}`} onClick={onCancel}>
                {'<'}
            </button>
            <br/>
            <br/>
            {postits.map((postit, index) => {
                if (receivedLike && receivedLike.includes(postit.user_id)) {
                    return (
                        <div key={index} className={`list-container ${postit.sex}`}>
                            <div className="myHeader">
                                <img
                                    src={process.env.PUBLIC_URL + `/emoji_png/${getEmogi(postit.emogi)}.png`}
                                    alt="Emogi"
                                    style={{ width: '60px', height: '60px' }}
                                />
                                <div>
                                    <h4 style={{ marginLeft: '10px' }}>{postit.name}님이 like를 눌렀어요.</h4>
                                </div>
                                <button className={`more-button ${postit.sex}`} onClick={() => onShowSubpage(postit.user_id)}><SearchOutlined  style={{fontSize: '14px', color: 'black'}}/></button> 
                            </div>
                        </div>
                    );
                } else {
                    return null;
                }
            })}
        </div>
    );
}

export default LikeList;