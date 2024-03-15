import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Subpage from './sub_page'; 
import './sub_page.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './snow.scss';
import Menual from './howToUse';
import Chat from './chat';
import AdComponent from './AdComponent';

function App() {
    const [postits, setPostits] = useState([]);
    const [showSubpage, setShowSubpage] = useState(false);
    const [viewport, setViewport] = useState({ x: 0, y: 0, width: 100, height: 100 });
    // const url = 'https://3.27.141.88';
    // const url = 'https://p7219.site' 
    const url = process.env.REACT_APP_SERVER_API;
    const navigate = useNavigate();
    const [showMenual, setShowMenual] = useState(true);
    const [showChat, setShowChat] = useState(false);

    // emogi가 1이면 cat, 2면 dog, 3이면 fox, 4 : hamster, 5 : horse, 6: lion, 7: monkey, 8: panda, 9: rabbit, 10: t-rex, 11: tiger 
    // emogi숫자가 들어오면 해당하는 문자를 반환하는 함수
    const getEmogi = (emogi) => {
        if (emogi === 1) {
            return 'cat';
        } else if (emogi === 2) {
            return 'dog';
        } else if (emogi === 3) {
            return 'fox';
        } else if (emogi === 4) {
            return 'hamster';
        } else if (emogi === 5) {
            return 'horse';
        } else if (emogi === 6) {
            return 'lion';
        } else if (emogi === 7) {
            return 'monkey';
        } else if (emogi === 8) {
            return 'panda';
        } else if (emogi === 9) {
            return 'rabbit';
        } else if (emogi === 10) {
            return 't-rex';
        } else if (emogi === 11) {
            return 'tiger';
        }
    }

    //dummy data
    useEffect(() => {
        const generateDummyData = (count) => {
            const dummyData = [];
          
            for (let i = 1; i <= count; i++) {
              const data = {
                id: i,
                x: getRandomCoordinate(),
                y: getRandomCoordinateY(),
                content_mbti: generateRandomMbti(),
                content_hobby: [generateRandomHobby(), generateRandomHobby()],
                sex: generateRandomSex(),
                emogi: getEmogi(generateRandomEmogi()),
              };
          
              dummyData.push(data);
            }
          
            return dummyData;
          };
          
          const getRandomCoordinate = () => {
            return Math.floor(Math.random() * 3001) + 200 ; // -1500 to 1500
          };

          const getRandomCoordinateY = () => {
            return Math.floor(Math.random() * 3001) + 50; // 0 to 3000
          }

          const generateRandomMbti = () => {
            const mbtiOptions = ["INTJ", "ENFP", "ISTP", /* Add more MBTI types as needed */];
            const randomIndex = Math.floor(Math.random() * mbtiOptions.length);
            return mbtiOptions[randomIndex];
          };
          
          const generateRandomHobby = () => {
            const hobbyOptions = ["독서", "여행", "요리", /* Add more hobbies as needed */];
            const randomIndex = Math.floor(Math.random() * hobbyOptions.length);
            return hobbyOptions[randomIndex];
          };
          
          const generateRandomSex = () => {
            const sexOptions = ["male", "female"];
            const randomIndex = Math.floor(Math.random() * sexOptions.length);
            return sexOptions[randomIndex];
          };

          const generateRandomEmogi = () => {
            //1~11까지 랜덤 숫자 생성
            const randomIndex = Math.floor(Math.random() * 11) + 1;
            return randomIndex;
          }
          
          const count = 10;
          const dummyData = generateDummyData(count);
        
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
            postit: newPostit,
        };
        // console.log(newPostit);
        //포스트잇 생성 요청.
        const headers = {
            Authorization: `Bearer ${access_token}` // 'Bearer'는 일반적인 인증 스킴입니다.
        };

        if (access_token) {
            // console.log("submit!!!");
            axios.post(url + endpoint, payload, { headers })
                 .then(response => {
                     // console.log(response);
                 })
                 .catch(error => {
                    // console.log(payload);
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
                // console.log(response);
            })
            .catch(error => {
                console.error('move Fail:', error);
                // console.log(payload);
                
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
            // console.log(response);
            localStorage.setItem('token', response.data.access_token);
        })
        .catch(error => {
            console.error('토큰을 갱신하는 데 실패했습니다:', error);
            handleLogout();
        });
    };

    // + 버튼을 누렀을 때 포스트잇 입력 페이지 로드
    // const handleOpenSubpage = () => {
    //     setShowSubpage(true);
    // };

    const handleAddPostitFromSubpage = (text) => {
        // console.log('text : ' + text);
        const textArray = text.split('\n');
        // console.log(textArray);
        const [mbtiValue, hobbyValue, instaIdValue] = textArray;
        const freeFormValue = textArray.slice(3).join('\n');
        const sex = localStorage.getItem('sex'); // 성별 가져오기
        // console.log(sex);

        const randomX = Math.random() * 2700 - 1500; // 포스트잇 너비를 고려
        const randomY = Math.random() * 2700; // 포스트잇 높이를 고려

        const newPostit = {
            id: new Date().getTime(),
            x: randomX,
            y: randomY,
            content_mbti: freeFormValue ? freeFormValue : mbtiValue,
            content_hobby: freeFormValue ? '' : hobbyValue,
            content_insta: freeFormValue ? '' : instaIdValue,
            // content_free_form: freeFormValue,
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
        // console.log(postits);
        setShowSubpage(false);

        window.scrollTo({
            top: newPostit.y - window.innerHeight / 2, // 화면 중앙에 위치하도록 조정
            left: newPostit.x + 1500 - window.innerWidth / 2,
            behavior: 'smooth'
        });
    };

    // useEffect(() => {
    //     console.log(postits);
    // }, [postits]);

    const handleDragStart = (e, id) => {
        e.preventDefault();
        const postit = postits.find(p => p.id === id);
        // console.log(postit.id);
        const validId = localStorage.getItem('user_id');
        console.log(postit.x, postit.y);
        // console.log(postit.user_id);
        // console.log(validId);
        // const documentWidth = document.documentElement.scrollWidth;
        // const documentHeight = document.documentElement.scrollHeight;
        if (postit.user_id == validId) {
            const offsetX = e.clientX - (postit.x / 3000) * window.innerWidth;
            const offsetY = e.clientY - (postit.y / 3000) * window.innerHeight;

            const onDrag = (event) => {
                let newPosX = (event.clientX - offsetX) / window.innerWidth * 3000;
                let newPosY = (event.clientY - offsetY) / window.innerHeight * 3000;

                if (newPosX < 200) newPosX = 200;
                if (newPosX > 3200) newPosX = 3200;
                if (newPosY < 50) newPosY = 50;
                if (newPosY > 3050) newPosY = 3050;

                postit.x = newPosX;
                postit.y = newPosY;
                setPostits([...postits]);
                // handleSubmit(postits[0]);
                // handleDragSubmit(newPosX, newPosY);
            };

            const onDragEnd = () => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', onDragEnd);
            handleDragSubmit(postit.x, postit.y);
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
        const postit = postits.find(p => p.id === id);
        const validId = localStorage.getItem('user_id');

        if(postit.user_id == validId) {
            // 서버에 삭제 요청을 보내는 함수
            const sendDeleteRequest = () => {
                axios.post(url + endpoint, payload, {headers})
                .then(response => {
                    // console.log('포스트잇 삭제 성공:', response.data);
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
        }
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
            left: `${(postit.x / 3300) * 100}%`,
            top: `${(postit.y / 3300) * 100}%`,
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
            //const isCursorOverMargin = e.clientX > window.innerWidth - 20;
            // console.log('Mouse Over Right Margin:', isCursorOverMargin);
    
            scrollIntervalRight = setInterval(() => {
                window.scrollBy(10, 0);
            }, 20);
        };
    
        const handleMouseOverLeft = (e) => {
            //const isCursorOverMargin = e.clientX < 20;
            // console.log('Mouse Over Left Margin:', isCursorOverMargin);
    
            scrollIntervalLeft = setInterval(() => {
                window.scrollBy(-10, 0);
            }, 20);
        };
    
        const handleMouseOutRight = (e) => {
            //const isCursorOutsideMargin = e.clientX <= window.innerWidth - 20;
            // console.log('Mouse Out of Right Margin:', !isCursorOutsideMargin);
    
            clearInterval(scrollIntervalRight);
        };
    
        const handleMouseOutLeft = (e) => {
            //const isCursorOutsideMargin = e.clientX >= 20;
            // console.log('Mouse Out of Left Margin:', !isCursorOutsideMargin);
    
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

    const handleMenualClose = () => {
        setShowMenual(false);
    }

    const handleChatButtonClick = () => {
        setShowChat(prevShowChat => !prevShowChat);
      };

    return (
        <div className="App">
            
           {/* {Array.from({ length: 400 }).map((_, index) => (
                <div key={index} className="snow"></div>
            ))} */}
        {showSubpage && 
            <Subpage 
            onAdd={handleAddPostitFromSubpage} 
            onCancel={() => setShowSubpage(false)}
            />
        } 
        {/* {showChat &&
            <Chat 
            
            onClose={() => setShowChat(false)} />
        } */}
        <Chat showChat={showChat} onClose={() => setShowChat(false)} />
        {postits.map(postit => (
            <div 
            key={postit.id} 
            className = {`rgyPostIt ${postit.sex}`}
            style={{ left: postit.x, top: postit.y}}
            onMouseDown={e => handleDragStart(e, postit.id)}
            >
                <button className="close-button" onClick={() => handleDeletePostit(postit.id)}>X</button>

                    {/* emogi가 1이면 cat, 2면 dog, ... (public에 이미지 순서대로 사용) */}
                    <div>
                        <img src={process.env.PUBLIC_URL + `/emoji_png/${postit.emogi}.png`} alt="Emogi" style={{ width: '60px', height: '60px' }} />    
                    </div>
                    <br/>
                    <div>
                        MBTI  : {postit.content_mbti}
                    </div>
                    <br/>
                    <div>
                        Hobby : {postit.content_hobby}
                    </div>
                    {/* {`Insta ID : ` + postit.content_insta}<br/> */}
            </div>
        ))}
        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
        {/* <button className="add-button" onClick={handleOpenSubpage}>+</button> */}
        <button className="chat-button" onClick={handleChatButtonClick}>💬</button>
        <div className="minimap" style={{ position: 'fixed', bottom: 0, left: 0, width: '200px', height: '200px', backgroundColor: 'rgba(0, 0, 0, 0.3)', overflow: 'hidden' ,zIndex: '100'}}>
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
            <div>
                {showMenual && <Menual onClose={handleMenualClose} />}
            </div>
            <AdComponent style={{ position: 'absolute', left: '0px', top: '100px' }}/>
            <AdComponent style={{ position: 'absolute', left: '0px', top: '1700px' }}/>
            <AdComponent style={{ position: 'absolute', right: '-2267px', top: '100px' }}/>
            <AdComponent style={{ position: 'absolute', right: '-2267px', top: '1700px' }}/>
        </div>
    );
}

export default App;

