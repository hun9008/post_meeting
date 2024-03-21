import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './edit.scss';

function SignUp_page2({handleNextPage, onSubmit, handlePreviousPage, onCancel}) {

    const navigate = useNavigate();
    const [InE, setInE] = useState('');
    const [NnS, setNnS] = useState('');
    const [FnT, setFnT] = useState('');
    const [PnJ, setPnJ] = useState('');
    const [hobby, setHobby] = useState([]);
    const isFormValid = InE && NnS && FnT && PnJ && hobby;

    const handleSubmit = (e) => {
        const page2_data = {
            mbti : InE + NnS + FnT + PnJ,
            hobby : hobby
        };
        e.preventDefault();
        onSubmit(page2_data);
        handleNextPage();
    };

    const toggleHobby = (value) => {
        if (hobby.includes(value)) {
            setHobby(hobby.filter(f => f !== value));
        } else {
            setHobby([...hobby, value]);
        }
    };

    return (
        <div>
            <form className='signUp' onSubmit={handleSubmit}>
                <button className='back-button' onClick={onCancel}>
                    {'<'}
                </button>
                <h2>Page2</h2>

                <div>
                    MBTI
                    <div style={{ display:'flex',  flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{ display:'flex',  flexDirection: 'column'}}>
                            <button 
                                type="button" 
                                onClick={() => setInE('I')}
                                className={InE === 'I' ? 'chooseButton selected' : 'chooseButton'}
                            >
                                I
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setInE('E')}
                                className={InE === 'E' ? 'chooseButton selected' : 'chooseButton'}
                            >
                                E
                            </button>
                        </div>
                        <div style={{ display:'flex',  flexDirection: 'column'}}>
                            <button 
                                type="button" 
                                onClick={() => setNnS('N')}
                                className={NnS === 'N' ? 'chooseButton selected' : 'chooseButton'}
                            >
                                N
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setNnS('S')}
                                className={NnS === 'S' ? 'chooseButton selected' : 'chooseButton'}
                            >
                                S
                            </button>
                        </div>
                        <div style={{ display:'flex',  flexDirection: 'column'}}>
                            <button 
                                type="button" 
                                onClick={() => setFnT('F')}
                                className={FnT === 'F' ? 'chooseButton selected' : 'chooseButton'}
                            >
                                F
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setFnT('T')}
                                className={FnT === 'T' ? 'chooseButton selected' : 'chooseButton'}
                            >
                                T
                            </button>
                        </div>
                        <div style={{ display:'flex',  flexDirection: 'column'}}>
                            <button 
                                type="button" 
                                onClick={() => setPnJ('P')}
                                className={PnJ === 'P' ? 'chooseButton selected' : 'chooseButton'}
                            >
                                P
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setPnJ('J')}
                                className={PnJ === 'J' ? 'chooseButton selected' : 'chooseButton'}
                            >
                                J
                            </button>
                        </div>
                    </div>
                </div>

                <br/>
                <div>
                    취미
                    <div>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('카페가기')}
                            className={hobby.includes('카페가기') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            카페가기
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('자전거')}
                            className={hobby.includes('자전거') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            자전거
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('패션')}
                            className={hobby.includes('패션') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            패션
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('반려동물')}
                            className={hobby.includes('반려동물') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            반려동물
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('술')}
                            className={hobby.includes('술') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            술
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('산책')}
                            className={hobby.includes('산책') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            산책
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('피트니스')}
                            className={hobby.includes('피트니스') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            피트니스
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('게임')}
                            className={hobby.includes('게임') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            게임
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('악기')}
                            className={hobby.includes('악기') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            악기
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('애니')}
                            className={hobby.includes('애니') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            애니
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('공연관람')}
                            className={hobby.includes('공연관람') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            공연관람
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('음악감상')}
                            className={hobby.includes('음악감상') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            음악감상
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('사진')}
                            className={hobby.includes('사진') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            사진
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('영화')}
                            className={hobby.includes('영화') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            영화
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('맛집')}
                            className={hobby.includes('맛집') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            맛집
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('웹툰')}
                            className={hobby.includes('웹툰') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            웹툰
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('드라이브')}
                            className={hobby.includes('드라이브') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            드라이브
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('봉사')}
                            className={hobby.includes('봉사') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            봉사
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('쇼핑')}
                            className={hobby.includes('쇼핑') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            쇼핑
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('자기계발')}
                            className={hobby.includes('자기계발') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            자기계발
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('드라마')}
                            className={hobby.includes('드라마') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            드라마
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('노래')}
                            className={hobby.includes('노래') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            노래
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('독서')}
                            className={hobby.includes('독서') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            독서
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('미용')}
                            className={hobby.includes('미용') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            미용
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('글쓰기')}
                            className={hobby.includes('글쓰기') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            글쓰기
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('요리')}
                            className={hobby.includes('요리') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            요리
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('스포츠')}
                            className={hobby.includes('스포츠') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            스포츠
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('여행')}
                            className={hobby.includes('여행') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            여행
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('그림')}
                            className={hobby.includes('그림') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            그림
                        </button>
                        <button 
                            type="button" 
                            onClick={() => toggleHobby('재테크')}
                            className={hobby.includes('재테크') ? 'chooseButtonH selected' : 'chooseButtonH'}
                        >
                            재테크
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