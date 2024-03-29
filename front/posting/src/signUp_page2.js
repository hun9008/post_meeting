import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signUp.scss';

function SignUp_page2({sex, handleNextPage, onSubmit, handlePreviousPage}) {
    const navigate = useNavigate();
    const [militaryService, setMilitaryService] = useState(false);
    const [height, setHeight] = useState('');
    const [bodyType, setBodyType] = useState('');
    const [eyelid, setEyelid] = useState(false);
    const [fashion, setFashion] = useState([]);
    const isFormValid = bodyType && fashion;

    const handleToggleMilitary = () => {
        setMilitaryService(militaryService === false ? true : false);
    };

    const handleEyelid = () => {
        setEyelid(eyelid === false ? true : false);
    };

    const toggleFashion = (value) => {
        if (fashion.includes(value)) {
            setFashion(fashion.filter(f => f !== value));
        } else {
            setFashion([...fashion, value]);
        }
    };

    const handleSubmit = (e) => {
        const page2_data = {
            militaryService: militaryService,
            height: height,
            bodyType: bodyType,
            eyelid: eyelid,
            fashion: fashion
        };
        e.preventDefault();
        onSubmit(page2_data);
        handleNextPage();
    };


    const handleBackButton = () => {
        navigate('/');
    }

    return (
        <div>
            <form className='signUp' onSubmit={handleSubmit}>
                <button className='back-button' onClick={handleBackButton}>
                    {'<'}
                </button>
                <h2>Page 2</h2>
                <div>
                    {sex === 'male' && (
                        <label>
                            군필 여부
                            <br/>
                            <div className="toggle-switch-military" style={{marginTop:5, marginBottom:5}}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={militaryService === true} 
                                    onChange={handleToggleMilitary} 
                                />
                                <span className="slider-military"></span>
                                </label>
                            </div>
                        </label>
                    )}
                </div>
                {sex === 'male' && (
                    <div>
                        <label>
                            키
                            <div>
                                <button 
                                    type="button" 
                                    onClick={() => setHeight(height === '160이하' ? '' : '160이하')}
                                    className={height === '160이하' ? 'chooseButton selected' : 'chooseButton'}
                                >
                                    160이하
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setHeight(height === '160대' ? '' : '160대')}
                                    className={height === '160대' ? 'chooseButton selected' : 'chooseButton'}
                                >
                                    160대
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setHeight(height === '170대' ? '' : '170대')}
                                    className={height === '170대' ? 'chooseButton selected' : 'chooseButton'}
                                >
                                    170대
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setHeight(height === '180대' ? '' : '180대')}
                                    className={height === '180대' ? 'chooseButton selected' : 'chooseButton'}
                                >
                                    180대
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setHeight(height === '180이상' ? '' : '180이상')}
                                    className={height === '180이상' ? 'chooseButton selected' : 'chooseButton'}
                                >
                                    180이상
                                </button>
                            
                            </div>
                        </label>
                    </div>
                )}
                <br />
                <div>
                    체형
                    <div>
                        <button 
                            type="button" 
                            onClick={() => setBodyType(bodyType === '마름' ? '' : '마름')}
                            className={bodyType === '마름' ? 'chooseButton selected' : 'chooseButton'}
                        >
                            마름
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setBodyType(bodyType === '보통' ? '' : '보통')}
                            className={bodyType === '보통' ? 'chooseButton selected' : 'chooseButton'}
                        >
                            보통
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setBodyType(bodyType === '근육' ? '' : '근육')}
                            className={bodyType === '근육' ? 'chooseButton selected' : 'chooseButton'}
                        >
                            근육
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setBodyType(bodyType === '통통' ? '' : '통통')}
                            className={bodyType === '통통' ? 'chooseButton selected' : 'chooseButton'}
                        >
                            통통
                        </button>
                    
                    </div>
                </div>
                <br/>
                <label>
                    쌍커풀
                    <br/>
                    <div className="toggle-switch-eyeType" style={{marginTop:5, marginBottom:5}}>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={eyelid === true} 
                                onChange={handleEyelid} 
                            />
                            <span className="slider-eyeType"></span>
                        </label>
                    </div>
                </label>
                
                <div>
                    페션 스타일(복수 선택 가능)
                    <div>
                        <button 
                            type="button" 
                            onClick={() => toggleFashion('클래식')}
                            className={fashion.includes('클래식') ? 'chooseButton selected' : 'chooseButton'}
                        >
                            클래식
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleFashion('캐주얼')}
                            className={fashion.includes('캐주얼') ? 'chooseButton selected' : 'chooseButton'}
                        >
                            캐주얼
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleFashion('스트릿')}
                            className={fashion.includes('스트릿') ? 'chooseButton selected' : 'chooseButton'}
                        >
                            스트릿
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleFashion('모던')}
                            className={fashion.includes('모던') ? 'chooseButton selected' : 'chooseButton'}
                        >
                            모던
                        </button>
                    
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
        </div>
    );
}

export default SignUp_page2;