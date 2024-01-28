import React from 'react';
import './howToUse.scss';

function HowToUse({onClose}) {

    return (
        <div className='h_container'>
            <button className='back-button' onClick={onClose}>
                {'<'}
            </button>
            <h2>How To Use</h2>
            <div>
                <div>
                    <h3>1. 학교 email로 회원가입/로그인 해주세요.</h3>
                    {/* <img src={"img/login.png"} alt="exampleImage" className="img"/> */}
                </div>
                <div>
                    <h3>2. 포스트잇에 원하는 내용을 써주세요.</h3>
                    <h4>기본형식 / 자유형식 중 선택할 수 있어요.</h4>
                    <img src={"img/make_postit.png"} alt="exampleImage" className="img"/>
                    <img src={"img/make_postit_free.png"} alt="exampleImage" className="img"/>
                    <h4>남자는 파란색, 여자는 분홍색으로 보여요.</h4>
                    <h4>한 사람당 1개만 작성 가능해요.</h4>
                </div>
                <div>
                    <h3>3. 마음에 드는 분에게 연락해보세요.</h3>
                    <img src={"img/postits_100.png"} alt="exampleImage" className="img" />
                </div>
                <div>
                    <h3>4. 화면 왼쪽, 오른쪽 끝에 커서를 올려두면 좌우로 움직여요.</h3>
                </div>
                <div>
                    <h3>5. 왼쪽 아래에 현재 포스트잇의 위치를 보여주는 미니맵이 있어요.</h3>
                    <img src={"img/minimap.png"} alt="exampleImage" className="img" />
                </div>
                <div className="info">
                    <p>문의 : intertw219@gmail.com</p>
                </div>
            </div>
        </div>
    );
}

export default HowToUse;