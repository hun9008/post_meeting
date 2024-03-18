import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signUp.scss';

function Edit_page_1({sex, handleNextPage, onSubmit, onCancel}) {
    const navigate = useNavigate();
    const [militaryService, setMilitaryService] = useState(false);
    const [height, setHeight] = useState('');
    const [bodyType, setBodyType] = useState('');
    const [eyelid, setEyelid] = useState(false);
    const [fashion, setFashion] = useState([]);
    const [nickname, setNickname] = useState('');
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
        const page1_data = {
            name: nickname,
            militaryService: militaryService,
            height: height,
            bodyType: bodyType,
            eyelid: eyelid,
            fashion: fashion
        };
        e.preventDefault();
        onSubmit(page1_data);
        handleNextPage();
    };

    return (
        <div>
            <form className='signUp' onSubmit={handleSubmit}>
                <button className='back-button' onClick={onCancel}>
                    {'<'}
                </button>
                <h2>Page 1</h2>
                <div>
                    <label>
                        닉네임
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="닉네임을 입력해주세요."
                        />
                    </label>
                </div>
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
                                    onClick={() => setHeight('160이하')}
                                    className={height === '160이하' ? 'chooseButton selected' : 'chooseButton'}
                                >
                                    160이하
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setHeight('160대')}
                                    className={height === '160대' ? 'chooseButton selected' : 'chooseButton'}
                                >
                                    160대
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setHeight('170대')}
                                    className={height === '170대' ? 'chooseButton selected' : 'chooseButton'}
                                >
                                    170대
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setHeight('180대')}
                                    className={height === '180대' ? 'chooseButton selected' : 'chooseButton'}
                                >
                                    180대
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setHeight('180이상')}
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
                            onClick={() => setBodyType('마름')}
                            className={bodyType === '마름' ? 'chooseButton selected' : 'chooseButton'}
                        >
                            마름
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setBodyType('보통')}
                            className={bodyType === '보통' ? 'chooseButton selected' : 'chooseButton'}
                        >
                            보통
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setBodyType('근육')}
                            className={bodyType === '근육' ? 'chooseButton selected' : 'chooseButton'}
                        >
                            근육
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setBodyType('통통')}
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

export default Edit_page_1;