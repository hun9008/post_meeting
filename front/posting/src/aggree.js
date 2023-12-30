import React from 'react';
import './aggree.scss';

function ShowAggree({onClose}) {
    //2개의 조항에 대해 보여준다.

    return (
        <div className="container">
            <h2>개인정보처리동의서</h2>
            <div>
                <div>
                    <div>
                        <h3>제 1조(개인정보 보유 및 이용기간)</h3>
                    </div>
                    <div>
                        <p>1. 수집한 개인정보는 수집, 이용 동의일로부터 개인정보 수집, 이용 목적을 달성할 때까지 보관 및 이용합니다.</p>
                        <p>2. 개인정보 보유기간의 경과, 처리목적의 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
                    </div>
                </div>
                <div>
                    <div>
                        <h3>제 2조(동의 거부 관리)</h3>
                    </div>
                    <div>
                        <p>귀하는 본 안내에 따른 개인정보 수집, 이용에 대하여 동의를 거부하실 수 있으며, 이에 따른 불이익은 없습니다.</p>
                    </div>
                </div>
            </div>
            <button className="button" onClick={onClose}>닫기</button>
        </div>
    );
}

export default ShowAggree;