import React from 'react';
import './howToUse.scss';

function HowToUse({onClose}) {

    return (
        <div className='h_container'>
            <button className='back-button' onClick={onClose}>
                {'Close'}
            </button>
            <h2>How To Use</h2>
            <div>
                <div>
                    <h3 style={{fontWeight:'bold'}}>안녕하세요! 포스트잇 미팅을 이용해주셔서 감사합니다.</h3>
                    <p>원활한 사용을 위해 <span style={{color:'red'}}>PC</span>를 권장합니다.</p>

                    <p>(모바일도 가능하나 기능제한이 있을 수 있어요.)</p>
                </div>
                <div>
                    <h3>1. 학교 email로 회원가입/로그인 해주세요.</h3>
                </div>
                <div>
                    <h3>2. 포스트잇은 자동으로 생성되요.</h3>
                    <img src={"img/postit_male.png"} alt="exampleImage" className="img"/>
                    <img src={"img/postit_female.png"} alt="exampleImage" className="img" style={{height: '330'}}/>
                    <h4>남자는 <span style={{color:'blue'}}>파란색</span>, 여자는 <span style={{color:'red'}}>빨간색</span>으로 보여요.</h4>
                </div>
                <div>
                    <h3>3. 포스트잇을 <span style={{color:'red'}}>더블클릭</span>하면 세부정보를 알 수 있어요.</h3>
                    <img src={"img/postit_detail.png"} alt="exampleImage" className="img" />
                </div>
                <div>
                    <h3>4. 마이페이지에서 <span style={{color:'red'}}>연필</span>버튼을 누르면</h3>
                    <h3>나의 정보를 <span style={{color:'red'}}>수정</span>할 수 있어요.</h3>
                    <img src={"img/edit.png"} alt="exampleImage" className="img" />
                </div>
                <div>
                    <h3>5. 포스트잇을 <span style={{color:'red'}}>드래그</span>하면 원하는 위치로 </h3>
                    <h3> 이동할 수 있어요.</h3>
                    <p>포스트잇이 겹쳐 있다면 위치를 움직여 보세요.</p>
                    <p>포스트잇을 클릭하면 해당 포스트잇이 위로 올라와요.</p>
                </div>
                <div>
                    <h3>6. 마음에 드는 포스트잇이 있으면 <span style={{color:'red'}}>LIKE</span>를 누르세요.</h3>
                    <img src={"img/postit_like.png"} alt="exampleImage" className="img" />
                </div>
                <div>
                    <h3>7. Like가 서로 겹치면 등록한 email로 알람이 가요.</h3>
                    <img src={"img/email.jpg"} alt="exampleImage" className="img" />
                </div>
                <div>
                    <h3>8. <span style={{color:'red'}}>채팅</span> 기능을 이용해 상대와 연락해볼 수 있어요.</h3>
                    <img src={"img/postit_chat.png"} alt="exampleImage" className="imgChat" />
                </div>
                <div>
                    <h3>9. <span style={{color:'red'}}>MY LIKE</span>버튼을 누르면 </h3>
                    <h3>나를 좋아요 한 포스트잇을 확인할 수 있어요.</h3>
                    <img src={"img/likelist.png"} alt="exampleImage" className="img" />
                </div>
                <div>
                    <h3>10. PC에서는 화면 왼쪽 오른쪽 끝에 </h3>
                    <h3>커서를 올려두면 좌우로 움직여요.</h3>
                </div>
                <div>
                    <h3>11. 왼쪽 아래에 현재 포스트잇의 위치를</h3>
                    <h3>보여주는 <span style={{color:'red'}}>미니맵</span>이 있어요.</h3>
                    <p>나의 포스트잇은 노란색으로 표시되요.</p>
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