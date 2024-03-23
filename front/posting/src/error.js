import React from 'react';
import { useNavigate } from 'react-router-dom';

function ErrorPage() {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/');
    }
    return (
        <div style={{position: 'fixed', top: 'calc(50% - 150px)', left: 'calc(50% - 150px)'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '300px', height: '300px', backgroundColor: '#f8f861', borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'}}>
            <h2 style={{fontSize: '18px', fontWeight: 'bold', textAlign: 'center'}}>서비스 개선 중입니다.</h2>
            <p style={{marginTop: '8px', fontSize: '14px', textAlign: 'center'}}>잠시만 기다려 주세요!</p>
            <button style={{
                cursor: 'pointer',
                color: 'black',
                fontSize: '16px',
                textTransform: 'uppercase',
                width: '85px',
                border: '0',
                padding: '10px 0',
                position: 'fixed',
                borderRadius: '5px',
                backgroundColor: 'rgb(248, 195, 22)',
                top: 'calc(50% + 80px)',
            }} onClick={goToLogin}>처음으로</button>
        </div>
        </div>
    );
}

export default ErrorPage;