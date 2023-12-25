import React, { useState, useEffect } from 'react';
import './App.css';
import Subpage from './sub_page'; 
import './sub_page.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function App() {
    const [postits, setPostits] = useState([]);
    const [showSubpage, setShowSubpage] = useState(false);
    const [viewport, setViewport] = useState({ x: 0, y: 0, width: 100, height: 100 });
    const url = 'http://localhost:8000'; 
    const navigate = useNavigate();

    //dummy data
    useEffect(() => {
        const dummyData = [
            {
                id: 1,
                x: 100,
                y: 200,
                content_mbti: "INTJ",
                content_hobby: "독서",
                content_insta: "@example1",
                sex: "male"
            },
            {
                id: 2,
                x: 300,
                y: 400,
                content_mbti: "ENFP",
                content_hobby: "여행",
                content_insta: "@example2",
                sex: "female"
            },
            {
                id: 3,
                x: 500,
                y: 600,
                content_mbti: "ISTP",
                content_hobby: "요리",
                content_insta: "@example3",
                sex: "male"
            }
        ];
    
        setPostits(dummyData);
    }, []);
    

    useEffect(() => {
        const endpoint = '/api/postit/all';
        const access_token = localStorage.getItem('token');

        const headers = {
            'Content-Type': `application/json`,
            'ngrok-skip-browser-warning': '69420',
            Authorization: `Bearer ${access_token}` // 'Bearer'는 일반적인 인증 스킴입니다.
        };

        axios.get(url + endpoint, { headers })
            .then(response => {
                // 배열인지 확인하고, 배열이면 상태를 업데이트합니다.
                if (Array.isArray(response.data.postits)) {
                    setPostits(response.data.postits);
                } else {
                    console.error('받아온 데이터가 배열이 아닙니다:', response.data);
                    // 추가적인 에러 핸들링 로직
                }
            })
            .catch(error => {
                console.error('포스트잇 데이터를 가져오는 데 실패했습니다:', error);
            });
    }, []);

    const handleSubmit = (newPostit) => {
        const endpoint = '/api/postit/make'
        const access_token = localStorage.getItem('token');
        const payload = {
            // name: 'hun9008', //이게 필요한가?
            // email: 'younghune135@ajou.ac.kr', // 암호화 필요?
            // role: 'student', //이게 필요한가?
            // postit: {postits},
            postit: newPostit,
            // created_at: "2023-11-04T16:36:44.295Z", //이게 필요한가?
            // updated_at: "2023-11-04T16:36:44.295Z" //이게 필요한가?
        };
        console.log(newPostit);
        //포스트잇 생성 요청.
        const headers = {
            Authorization: `Bearer ${access_token}` // 'Bearer'는 일반적인 인증 스킴입니다.
        };

        if (access_token) {
            console.log("submit!!!");
            axios.post(url + endpoint, payload, { headers })
                 .then(response => {
                     console.log(response);
                 })
                 .catch(error => {
                    console.log(payload);
                     console.error('서버에 포스트잇 상태를 저장하는 데 실패했습니다:', error);
                    handleRefresh();
                    
                });
        }
    };

    const handleDragSubmit = (x, y) => {
        const endpoint = '/api/postit/move'
        const access_token = localStorage.getItem('token');
        const payload = {
            x: x,
            y: y,
            user_id: localStorage.getItem('user_id'),
        };

        const headers = {
            Authorization: `Bearer ${access_token}`
        };

        axios.post(url + endpoint, payload, {headers})
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error('move Fail:', error);
                console.log(payload);
                //handleRefresh();
                
            });
        
        
    };

    const handleRefresh = () => {
        const endpoint = '/api/auth/refresh'
        const refresh_token = localStorage.getItem('refresh_token');

        const headers = {
            'Content-Type': `application/json`,
            'ngrok-skip-browser-warning': '69420',
            Authorization: `Bearer ${refresh_token}` // 'Bearer'는 일반적인 인증 스킴입니다.
        };

        axios.get(url + endpoint, { headers })
        .then(response => {
            console.log(response);
            localStorage.setItem('token', response.data.access_token);
        })
        .catch(error => {
            console.error('토큰을 갱신하는 데 실패했습니다:', error);
            handleLogout();
        });
    };

    const handleOpenSubpage = () => {
        setShowSubpage(true);
    };

    const handleAddPostitFromSubpage = (text) => {
        const [mbtiValue, hobbyValue, instaIdValue, freeFormValue] = text.split('\n');
        const sex = localStorage.getItem('sex'); // 성별 가져오기
        console.log(sex);

        const randomX = Math.random() * 3000 - 1500; // 포스트잇 너비를 고려
        const randomY = Math.random() * 3000; // 포스트잇 높이를 고려

        const newPostit = {
            id: new Date().getTime(),
            x: randomX,
            y: randomY,
            content_mbti: mbtiValue,
            content_hobby: hobbyValue,
            content_insta: instaIdValue,
            content_free_form: freeFormValue,
            sex: sex,
            user_id: localStorage.getItem('user_id'),
        };
        //localStorage.setItem('id', newPostit.id);
        handleSubmit(newPostit); 
        setPostits(prevPostits => {
            const updatedPostits = [...prevPostits, newPostit];
            //localStorage.setItem('id', newPostit.id);
            handleSubmit(newPostit); // 새로 추가된 포스트잇을 인자로 전달
            return updatedPostits;
        });
        console.log(postits);
        setShowSubpage(false);

        window.scrollTo({
            top: newPostit.y - window.innerHeight / 2, // 화면 중앙에 위치하도록 조정
            left: newPostit.x + 1500 - window.innerWidth / 2,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        console.log(postits);
    }, [postits]);

    const handleDragStart = (e, id) => {
        e.preventDefault();
        const postit = postits.find(p => p.id === id);
        // console.log(postit.id);
        const validId = localStorage.getItem('user_id');
        console.log(postit.user_id);
        console.log(validId);
        // const documentWidth = document.documentElement.scrollWidth;
        // const documentHeight = document.documentElement.scrollHeight;
        if (postit.user_id == validId) {
            const offsetX = e.clientX - (postit.x / 3000) * window.innerWidth;
            const offsetY = e.clientY - (postit.y / 3000) * window.innerHeight;

            const onDrag = (event) => {
                const newPosX = (event.clientX - offsetX) / window.innerWidth * 3000;
                const newPosY = (event.clientY - offsetY) / window.innerHeight * 3000;
                postit.x = newPosX;
                postit.y = newPosY;
                setPostits([...postits]);
                // handleSubmit(postits[0]);
                handleDragSubmit(newPosX, newPosY);
            };

            const onDragEnd = () => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', onDragEnd);
            //handleSubmit();
            };

            window.addEventListener('mousemove', onDrag);
            window.addEventListener('mouseup', onDragEnd);
        }
    };

    const handleDeletePostit = (id) => {
        const endpoint = '/api/postit/remove';
        const access_token = localStorage.getItem('token');

        const headers = {
            Authorization: `Bearer ${access_token}` // 'Bearer'는 일반적인 인증 스킴입니다.
        };
        const payload = {
            id: id,
        }

        // 서버에 삭제 요청을 보내는 함수
        const sendDeleteRequest = () => {
            axios.post(url + endpoint, payload, {headers})
            .then(response => {
                console.log('포스트잇 삭제 성공:', response.data);
                // 서버에서 삭제가 성공적으로 이루어지면, 프론트엔드 상태도 업데이트
                const updatedPostits = postits.filter(postit => postit.id !== id);
                setPostits(updatedPostits);
            })
            .catch(error => {
                console.error('포스트잇 삭제 실패:', error);
                handleRefresh();
               // handleDeletePostit();
            });
        };
    
        // 서버에 삭제 요청을 보내는 함수 호출
        sendDeleteRequest();

        //임시 삭제 구현
        // const updatedPostits = postits.filter(postit => postit.id !== id);
        // setPostits(updatedPostits);
    };

    useEffect(() => {
        const handleScroll = () => {
          // 스크롤에 따라 뷰포트 정보를 업데이트
          const viewportWidth = (window.innerWidth / document.documentElement.scrollWidth) * 100;
          const viewportHeight = (window.innerHeight / document.documentElement.scrollHeight) * 100;
          const viewportX = (window.scrollX / document.documentElement.scrollWidth) * 100;
          const viewportY = (window.scrollY / document.documentElement.scrollHeight) * 100;
    
          setViewport({ x: viewportX, y: viewportY, width: viewportWidth, height: viewportHeight });
        };
    
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // 초기 뷰포트 위치 설정
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const renderPostitPoints = () => {
        return postits.map((postit) => {
          const style = {
            position: 'absolute',
            left: `${(postit.x / 3000) * 100 + 50}%`,
            top: `${(postit.y / 3000) * 100}%`,
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: 'red'
          };
          return <div key={postit.id} style={style}></div>;
        });
      };

    const handleLogout = () => {
        // const endpoint = '/api/auth/logout';


        // axios.get(url + endpoint)
        //     .then(response => {
        //         console.log(response);
        //         localStorage.clear();
        //         Navigate('/');
        //     })
        //     .catch(error => {
        //         console.error('로그아웃에 실패했습니다:', error);
        //     });
        localStorage.clear();
        navigate('/');
    };

    // adding
    let scrollIntervalRight;
    let scrollIntervalLeft;
    
    useEffect(() => {
        const marginElementRight = document.querySelector('.scroll-RightMargin');
        const marginElementLeft = document.querySelector('.scroll-LeftMargin');
    
        const handleMouseOverRight = (e) => {
            const isCursorOverMargin = e.clientX > window.innerWidth - 20;
            console.log('Mouse Over Right Margin:', isCursorOverMargin);
    
            scrollIntervalRight = setInterval(() => {
                window.scrollBy(10, 0);
            }, 20);
        };
    
        const handleMouseOverLeft = (e) => {
            const isCursorOverMargin = e.clientX < 20;
            console.log('Mouse Over Left Margin:', isCursorOverMargin);
    
            scrollIntervalLeft = setInterval(() => {
                window.scrollBy(-10, 0);
            }, 20);
        };
    
        const handleMouseOutRight = (e) => {
            const isCursorOutsideMargin = e.clientX <= window.innerWidth - 20;
            console.log('Mouse Out of Right Margin:', !isCursorOutsideMargin);
    
            clearInterval(scrollIntervalRight);
        };
    
        const handleMouseOutLeft = (e) => {
            const isCursorOutsideMargin = e.clientX >= 20;
            console.log('Mouse Out of Left Margin:', !isCursorOutsideMargin);
    
            clearInterval(scrollIntervalLeft);
        };
    
        marginElementRight.addEventListener('mouseover', handleMouseOverRight);
        marginElementRight.addEventListener('mouseout', handleMouseOutRight);
        marginElementLeft.addEventListener('mouseover', handleMouseOverLeft);
        marginElementLeft.addEventListener('mouseout', handleMouseOutLeft);
    
        return () => {
            marginElementRight.removeEventListener('mouseover', handleMouseOverRight);
            marginElementRight.removeEventListener('mouseout', handleMouseOutRight);
            marginElementLeft.removeEventListener('mouseover', handleMouseOverLeft);
            marginElementLeft.removeEventListener('mouseout', handleMouseOutLeft);
        };
    }, []);
  

    return (
        <div className="App">
        {showSubpage && 
            <Subpage 
            onAdd={handleAddPostitFromSubpage} 
            onCancel={() => setShowSubpage(false)}
            />
        } 
        {postits.map(postit => (
            <div 
            key={postit.id} 
            className = {`rgyPostIt ${postit.sex}`}
            style={{ left: postit.x, top: postit.y}}
            onMouseDown={e => handleDragStart(e, postit.id)}
            >
                <button className="close-button" onClick={() => handleDeletePostit(postit.id)}>X</button>
                {`MBTI : ` + postit.content_mbti}<br/>
                {`Hobby : ` + postit.content_hobby}<br/>
                {`Insta ID : ` + postit.content_insta}<br/>
                {postit.content_free_form}<br/>
            </div>
        ))}
        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
        <button className="add-button" onClick={handleOpenSubpage}>+</button>
        <div className="minimap" style={{ position: 'fixed', bottom: 0, left: 0, width: '150px', height: '150px', backgroundColor: 'rgba(0, 0, 0, 0.3)', overflow: 'hidden' }}>
            {renderPostitPoints()}
            <div style={{ position: 'absolute', left: `${viewport.x}%`, top: `${viewport.y}%`, width: `${viewport.width}%`, height: `${viewport.height}%`, border: '2px solid red' }}></div>
        </div>
        <div
                className="scroll-RightMargin"
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '40px',
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    cursor: 'ew-resize',
                    zIndex: 1000
                }}
            ></div>
        <div
                className="scroll-LeftMargin"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '40px',
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    cursor: 'ew-resize',
                    zIndex: 1000
                }}
            ></div>
        </div>
    );
}

export default App;

