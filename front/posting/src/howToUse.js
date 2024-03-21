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
                    <h3>2. 포스트잇은 자동으로 생성되요.</h3>
                    {/* <h4>기본형식 / 자유형식 중 선택할 수 있어요.</h4> */}
                    <img src={"img/make_postit.png"} alt="exampleImage" className="img"/>
                    <img src={"img/make_postit_free.png"} alt="exampleImage" className="img"/>
                    <h4>남자는 파란색, 여자는 분홍색으로 보여요.</h4>
                    {/* <h4>한 사람당 1개만 작성 가능해요.</h4> */}
                </div>
                <div>
                    <h3>3. 포스트잇을 더블클릭하면 세부정보를 알 수 있어요.</h3>
                    <img src={"img/postits_100.png"} alt="exampleImage" className="img" />
                </div>
                <div>
                    <h3>마음에 드는 포스트잇이 있으면 like를 누르세요.</h3>
                    <h3>like가 서로 겹치면 등록한 email로 상대의 SNS ID가 전송되요.</h3>
                </div>
                <div>
                    <h3>채팅 기능을 이용해 상대와 연락해볼 수 있어요.</h3>
                </div>
                <div>
                    <h3>My Like버튼을 누르면 나를 좋아요 한 포스트잇을 확인할 수 있어요.</h3>
                    <h3>좌우로 움직여요.</h3>
                </div>
                <div>
                    <h3>4. 화면 왼쪽, 오른쪽 끝에 커서를 올려두면 </h3>
                    <h3>좌우로 움직여요.</h3>
                </div>
                <div>
                    <h3>5. 왼쪽 아래에 현재 포스트잇의 위치를</h3>
                    <h3>보여주는 미니맵이 있어요.</h3>
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