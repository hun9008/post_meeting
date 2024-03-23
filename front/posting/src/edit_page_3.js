import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './edit.scss';
import Policy from './aggree';

function SignUp_page3({onSubmit, handlePreviousPage, onAllSubmit, onCancel}) {
    const navigate = useNavigate();
    const [emogi, setEmogi] = useState(0);
    const [isAggreed, setIsAggreed] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const isFormValid = emogi && isAggreed;


    const handleSubmit = (e) => {
        const page3_data = {
            emogi: emogi
        };
        e.preventDefault();
        if (page3_data && e) {
            onSubmit && onSubmit(page3_data);
            onAllSubmit && onAllSubmit(e);
        }
    };

    const handleOpenPolicy = () => {
        setShowPolicy(true);
    }

    const handleCloseAggree = () => {
        setShowPolicy(false);
        setIsAggreed(true);
    }

    return (
        <div>
            <form className='signUp' onSubmit={handleSubmit}>
                <button className='back-button' onClick={onCancel}>
                    {'<'}
                </button>
                <h2>Page 3</h2>
                
                <div>
                    이모지 선택
                    <div>
                        <button 
                            type="button" 
                            onClick={() => setEmogi(1)}
                            className={emogi === 1 ? 'chooseButtonE selected' : 'chooseButtonE'}
                        >
                            <img src={process.env.PUBLIC_URL + '/emoji_png/cat.png'} alt="Cat Emoji" style={{ width: '40px', height: '40px' }} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setEmogi(2)}
                            className={emogi === 2 ? 'chooseButtonE selected' : 'chooseButtonE'}
                        >
                            <img src={process.env.PUBLIC_URL + '/emoji_png/dog.png'} alt="Dog Emoji" style={{ width: '40px', height: '40px' }} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setEmogi(3)}
                            className={emogi === 3 ? 'chooseButtonE selected' : 'chooseButtonE'}
                        >
                            <img src={process.env.PUBLIC_URL + '/emoji_png/fox.png'} alt="Fox Emoji" style={{ width: '40px', height: '40px' }} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setEmogi(4)}
                            className={emogi === 4 ? 'chooseButtonE selected' : 'chooseButtonE'}
                        >
                            <img src={process.env.PUBLIC_URL + '/emoji_png/hamster.png'} alt="Hamster Emoji" style={{ width: '40px', height: '40px' }} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setEmogi(5)}
                            className={emogi === 5 ? 'chooseButtonE selected' : 'chooseButtonE'}
                        >
                            <img src={process.env.PUBLIC_URL + '/emoji_png/horse.png'} alt="Horse Emoji" style={{ width: '40px', height: '40px' }} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setEmogi(6)}
                            className={emogi === 6 ? 'chooseButtonE selected' : 'chooseButtonE'}
                        >
                            <img src={process.env.PUBLIC_URL + '/emoji_png/lion.png'} alt="Lion Emoji" style={{ width: '40px', height: '40px' }} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setEmogi(7)}
                            className={emogi === 7 ? 'chooseButtonE selected' : 'chooseButtonE'}
                        >
                            <img src={process.env.PUBLIC_URL + '/emoji_png/monkey.png'} alt="Monkey Emoji" style={{ width: '40px', height: '40px' }} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setEmogi(8)}
                            className={emogi === 8 ? 'chooseButtonE selected' : 'chooseButtonE'}
                        >
                            <img src={process.env.PUBLIC_URL + '/emoji_png/panda.png'} alt="Panda Emoji" style={{ width: '40px', height: '40px' }} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setEmogi(9)}
                            className={emogi === 9 ? 'chooseButtonE selected' : 'chooseButtonE'}
                        >
                            <img src={process.env.PUBLIC_URL + '/emoji_png/rabbit.png'} alt="Rabbit Emoji" style={{ width: '40px', height: '40px' }} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setEmogi(10)}
                            className={emogi === 10 ? 'chooseButtonE selected' : 'chooseButtonE'}
                        >
                            <img src={process.env.PUBLIC_URL + '/emoji_png/t-rex.png'} alt="Trex Emoji" style={{ width: '40px', height: '40px' }} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setEmogi(11)}
                            className={emogi === 11 ? 'chooseButtonE selected' : 'chooseButtonE'}
                        >
                            <img src={process.env.PUBLIC_URL + '/emoji_png/tiger.png'} alt="Tiger Emoji" style={{ width: '40px', height: '40px' }} />
                        </button>
                        
                    
                    </div>
                </div>
                {/* 개인정보처리방침 동의 */}
                <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center', overflow: 'hidden'}}>
                    <input
                        type="checkbox"
                        checked={isAggreed}
                        onChange={(e) => setIsAggreed(e.target.checked)}
                    />
                    <div>
                        <button type="button" onClick={handleOpenPolicy} 
                         style={{background: 'none', border: 'none', color: 'black', textDecoration: 'underline'}}
                        >개인정보처리방침 동의</button> 
                    </div>
                </div>

                <button type="onClick" onClick={handlePreviousPage} style={{marginRight:5}}>
                    이전
                </button>
                <button type="submit"     
                    onClick={(e) => {
                    if (!isFormValid) {
                        e.preventDefault();
                        alert('폼을 모두 채워주세요.');
                    }
                }} style={{marginLeft:5}}>
                    다음
                </button>
            </form>
            <div>
                {showPolicy && <Policy onClose={handleCloseAggree}/>}
            </div>
        </div>
    );
}

export default SignUp_page3;