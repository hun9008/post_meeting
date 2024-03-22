import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import Subpage from './sub_page'; 
import './sub_page.scss';
import Mypage from './myPage';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './snow.scss';
import Menual from './howToUse';
import Chat from './chat';
import AdComponent from './AdComponent';
import './likeButton.scss';
import EditPage from './edit_page_main';
import LikeList from './myLikeList';
import {MessageOutlined} from '@ant-design/icons';
import {HeartFilled} from '@ant-design/icons';
import {HeartOutlined} from '@ant-design/icons';

function App() {
    const [postits, setPostits] = useState([]);
    const [showSubpage, setShowSubpage] = useState(false);
    const [viewport, setViewport] = useState({ x: 0, y: 0, width: 100, height: 100 });
    const url = process.env.REACT_APP_SERVER_API;
    const navigate = useNavigate();
    const [showMenual, setShowMenual] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const [selectedPostit, setSelectedPostit] = useState(null);
    const [myPostit, setMyPostit] = useState(null);
    const [isLike, setIsLike] = useState(false);
    const [showMypage, setShowMypage] = useState(false);
    const [showEditPage, setShowEditPage] = useState(false);
    const [receivedLike, setReceivedLike] = useState([]);
    const [showLikeList, setShowLikeList] = useState(false);
    // emogi가 1이면 cat, 2면 dog, 3이면 fox, 4 : hamster, 5 : horse, 6: lion, 7: monkey, 8: panda, 9: rabbit, 10: t-rex, 11: tiger 
    // emogi숫자가 들어오면 해당하는 문자를 반환하는 함수
    const [userMe, setUserMe] = useState({postit :{sex: 'none'}});
    const [receiver_id, setReceiver_id] = useState(''); // 채팅 상대방 id
    const shouldRenderMargins = window.innerWidth > 768 ? true : false; // Adjust the width threshold as needed
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

    // dummy data
    // useEffect(() => {
    //     const generateDummyData = (count) => {
    //         const dummyData = [];      
    //         for (let i = 1; i <= count; i++) {
    //           const data = {
    //             id: i,
    //             x: getRandomCoordinate(),
    //             y: getRandomCoordinateY(),
    //             content_mbti: generateRandomMbti(),
    //             content_hobby: [generateRandomHobby(), generateRandomHobby()],
    //             sex: generateRandomSex(),
    //             emogi: getEmogi(generateRandomEmogi()),
    //             fashion: generateFashion(),
    //             socialID: generateSocailID(),
    //             eyelid: generateEyeLid(),
    //             bodyType: generateBodyType(),
    //             name: 'Woo',
    //             // 성별이 male이면 militaryService, height를 가짐/ female이면 안가짐
    //             militaryService: generateRandomMilitaryService(),
    //             height: generateHeight(),
    //           };
          
    //           dummyData.push(data);
    //         }
          
    //         return dummyData;
    //       };
          
    //       const getRandomCoordinate = () => {
    //         return Math.floor(Math.random() * 3001) + 200 ; // -1500 to 1500
    //       };

    //       const getRandomCoordinateY = () => {
    //         return Math.floor(Math.random() * 3001) + 50; // 0 to 3000
    //       }

    //       const generateRandomMbti = () => {
    //         const mbtiOptions = ["INTJ", "ENFP", "ISTP", /* Add more MBTI types as needed */];
    //         const randomIndex = Math.floor(Math.random() * mbtiOptions.length);
    //         return mbtiOptions[randomIndex];
    //       };
          
    //       const generateRandomHobby = () => {
    //         const hobbyOptions = ["독서", "여행", "요리", /* Add more hobbies as needed */];
    //         const randomIndex = Math.floor(Math.random() * hobbyOptions.length);
    //         return hobbyOptions[randomIndex];
    //       };
          
    //       const generateRandomSex = () => {
    //         const sexOptions = ["male", "female"];
    //         const randomIndex = Math.floor(Math.random() * sexOptions.length);
    //         return sexOptions[randomIndex];
    //       };

    //       const generateRandomEmogi = () => {
    //         //1~11까지 랜덤 숫자 생성
    //         const randomIndex = Math.floor(Math.random() * 11) + 1;
    //         return randomIndex;
    //       }

    //       const generateRandomMilitaryService = () => {
    //         //true or false
    //         const randomIndex = Math.floor(Math.random() * 2);
    //         return randomIndex;
    //       }

    //       const generateHeight = () => {   
    //         //150~200까지 랜덤 숫자 생성
    //         const randomIndex = Math.floor(Math.random() * 51) + 150;
    //         return randomIndex;
    //       }

    //       const generateBodyType = () => {
    //         const bodyTypeOptions = ["마른", "보통", "근육", "통통"];
    //         const randomIndex = Math.floor(Math.random() * bodyTypeOptions.length);
    //         return bodyTypeOptions[randomIndex];
    //       }          

    //       const generateFashion = () => {
    //         const fashionOptions = ["캐주얼", "모던", "스트릿", "클래식"];
    //         const randomIndex = Math.floor(Math.random() * fashionOptions.length);
    //         return fashionOptions[randomIndex];
    //         }
          
    //     const generateSocailID = () => {
    //         const socialIDOptions = ["qwer1234", "mwwwee3", "yykkei42", "#include"];
    //         const randomIndex = Math.floor(Math.random() * socialIDOptions.length);
    //         return socialIDOptions[randomIndex];
    //     }

    //     const generateEyeLid = () => {
    //         //true or false
    //         const randomIndex = Math.floor(Math.random() * 2);
    //         return randomIndex;
    //     }

    //       const count = 10;
    //       const dummyData = generateDummyData(count);
        
    //     setPostits(dummyData);
    // }, []);
    

    useEffect(() => {
        const endpoint = '/api/postit/all';
        const access_token = localStorage.getItem('token');

        const headers = {
            // 'Content-Type': `application/json`,
            // 'ngrok-skip-browser-warning': '69420',
            Authorization: `Bearer ${access_token}` // 'Bearer'는 일반적인 인증 스킴입니다.
        };

        axios.get(url + endpoint, { headers })
            .then(response => {
                // 배열인지 확인하고, 배열이면 상태를 업데이트합니다.
                if (Array.isArray(response.data.postits)) {
                    // response.data.postits를 postits에 set할건데, true,false값을 가지는 liked를 추가
                    response.data.postits.map((postit) => {
                        postit.liked = false;
                    });
                    setPostits(response.data.postits);
                    console.log(response.data.postits);
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

    const handleDragStart = (e, user_id) => {
        e.preventDefault();
        const postit = postits.find(p => p.user_id === user_id);
        // console.log(postit.id);
        const validId = localStorage.getItem('user_id');
        // console.log(postit);
        // console.log(postit.user_id);
        // console.log(validId);
        // const documentWidth = document.documentElement.scrollWidth;
        // const documentHeight = document.documentElement.scrollHeight;

        e.target.style.zIndex = parseInt(e.target.style.zIndex || 0) + 1;

        if (postit.user_id == validId) {
            const offsetX = e.clientX - (postit.x / 3000) * window.innerWidth;
            const offsetY = e.clientY - (postit.y / 3000) * window.innerHeight;

            const onDrag = (event) => {
                let newPosX = (event.clientX - offsetX) / window.innerWidth * 3000;
                let newPosY = (event.clientY - offsetY) / window.innerHeight * 3000;

                if (newPosX < 200) newPosX = 200;
                if (newPosX > 3200) newPosX = 3000;
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

    const handleDeletePostit = (user_id) => {
        console.log('delete postit');
        const endpoint = '/api/postit/remove';
        const access_token = localStorage.getItem('token');

        const headers = {
            Authorization: `Bearer ${access_token}` // 'Bearer'는 일반적인 인증 스킴입니다.
        };
        const payload = {
            user_id: user_id,
        }
        const postit = postits.find(p => p.user_id === user_id);
        const validId = localStorage.getItem('user_id');

        if(postit.user_id == validId) {
            // 서버에 삭제 요청을 보내는 함수
            const sendDeleteRequest = () => {
                axios.post(url + endpoint, payload, {headers})
                .then(response => {
                    // console.log('포스트잇 삭제 성공:', response.data);
                    // 서버에서 삭제가 성공적으로 이루어지면, 프론트엔드 상태도 업데이트
                    const updatedPostits = postits.filter(postit => postit.user_id !== user_id);
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
        const padding = 140;
        return postits.map((postit) => {
          const style = {
            position: 'absolute',
            left: `${(postit.x / 3300) * 100}%`,
            top: `${((postit.y + padding) / 3300) * 100}%`,
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: 'red'
          };
          return <div key={postit.id} style={style}></div>;
        });
      };

    const handleLogout = () => {
        const endpoint = '/api/auth/logout';
        const access_token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${access_token}`
         };

        axios.get(url + endpoint, {headers})
            .then(response => {
                console.log(response);
                localStorage.clear();
                navigate('/');
            })
            .catch(error => {
                console.error('로그아웃에 실패했습니다:', error);
            });
        localStorage.clear();
        // navigate('/');
    };

    // adding
    let scrollIntervalRight;
    let scrollIntervalLeft;
    
    useEffect(() => {
        if(shouldRenderMargins) {
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
        }
    }, []);

    const handleMenualClose = () => {
        setShowMenual(false);
    }

    const handleChatButtonClick = (id) => {
        // id가 내 아이디와 같다면 채팅을 할 수 없음
        const myId = localStorage.getItem('user_id');
        if (id === myId) {
            alert('자신과는 채팅을 할 수 없습니다.');
        } else {
            console.log(`setting receiver_id : ${id}`);
            setReceiver_id(id);
            setShowChat(prevShowChat => !prevShowChat);
        }
      };


    // postit을 더블클릭하면 postit의 정보를 console.log로 출력
    const handlePostitDoubleClick = (e, id) => {
        const postit = postits.find(p => p.user_id === id);
        console.log(postit);
        // subPage를 로드
        setShowSubpage(true);
        setSelectedPostit(postit);
        
    }

    const handleSubpage = (id) => {
        const postit = postits.find(p => p.user_id === id);
        setSelectedPostit(postit);
        setShowSubpage(true);

    }

    const handleMyPostit = () => {
        const myId = localStorage.getItem('user_id');
        const myPostit = postits.find(p => p.user_id === myId);
        setMyPostit(myPostit);
    }

    // like버튼을 누르면 postit의 user_id와 내 아이디(localStorage)를 비교해, 다르다면 post 요청보냄
    const handleLikeButtonClick = (id, liked) => {
        const myId = localStorage.getItem('user_id');

        if (liked === false) {
            if (id !== myId) {
                const endpoint = `/api/like/sendlike/${myId}/${id}`;
                const access_token = localStorage.getItem('token');
                const payload = {

                };
                const headers = {
                    Authorization: `Bearer ${access_token}`
                };
                axios.post(url + endpoint, payload, {headers})
                    .then(response => {
                        console.log(response);
                        //id에 해당하는 postit의 liked를 true로 바꿔줌
                        const updatedPostits = postits.map(postit => 
                            postit.user_id === id ? { ...postit, liked: true } : postit);
                        setPostits(updatedPostits);
                        console.log(postits);
                        console.log('좋아요 요청 성공');
                    })
                    .catch(error => {
                        console.error('좋아요 요청 실패:', error);
                    });
            } else{
                alert('자신의 포스트잇에는 좋아요를 누를 수 없습니다.');
            }
        } else {
            if (id !== myId) {
                const endpoint = `/api/like/removelike/${myId}/${id}`;
                const access_token = localStorage.getItem('token');
                const payload = {

                };
                const headers = {
                    Authorization: `Bearer ${access_token}`
                };
                axios.post(url + endpoint, payload, {headers})
                    .then(response => {
                        console.log(response);
                        //id에 해당하는 postit의 liked를 false로 바꿔줌
                        const updatedPostits = postits.map(postit =>
                            postit.user_id === id ? { ...postit, liked: false } : postit);
                        setPostits(updatedPostits);
                        console.log(postits);
                        console.log('좋아요 취소 요청 성공');
                    })
                    .catch(error => {
                        console.error('좋아요 취소 요청 실패:', error);
                    });
            } else{
                alert('자신의 포스트잇에는 좋아요를 누를 수 없습니다.');
            }
        }



        console.log('like button clicked');
        // setIsLike(!isLike);
    }

    const getLike = () => {

        //보류.
        const endpoint = `/api/like/getlike/${localStorage.getItem('user_id')}`;
        const access_token = localStorage.getItem('token');

        const headers = {
            // 'Content-Type': `application/json`,
            // 'ngrok-skip-browser-warning': '69420',
            Authorization: `Bearer ${access_token}` 
        };

        axios.get(url + endpoint, {headers})
            .then(response => {
                console.log(response);
                setReceivedLike(response.data.receivedLike);
            })
            .catch(error => {
                console.error('좋아요 요청 실패:', error);
            });

    }

    useEffect(() => {
        const endpoint = `/api/users/me/${localStorage.getItem('user_id')}`;
        const access_token = localStorage.getItem('token');

        const headers = {
            // 'Content-Type': `application/json`,
            // 'ngrok-skip-browser-warning': '69420',
            Authorization: `Bearer ${access_token}`
        };

        axios.get(url + endpoint, {headers})
            .then(response => {
                console.log('user me : ',response);
                console.log('user : ', response.data.user);
                setUserMe(response.data.user);
            })
            .catch(error => {
                console.error('user/me 요청 실패:', error);
            });
    }, []);

    //postits를 돌면서 userMe.send_like에 있는 user_id와 같은 user_id를 가진 postit의 liked를 true로 바꿔줌
    useEffect(() => {
        if (userMe && postits.length !== 0) {
            const myId = localStorage.getItem('user_id');
            const myLike = userMe.send_like;
            console.log('myLike : ', myLike);
            console.log('postits : ', postits);
            const updatedPostits = postits.map(postit => 
                myLike.includes(postit.user_id) ? { ...postit, liked: true } : postit);
            setPostits(updatedPostits);
        }
    }, [userMe]);

    // if (userMe.postit == undefined) {
    //     console.log('loading');
    //     await(5000);
    // } 

    return (
        <div className="App">
            
           {/* {Array.from({ length: 400 }).map((_, index) => (
                <div key={index} className="snow"></div>
            ))} */}
        {showSubpage && 
            <Subpage 
            postit = {selectedPostit}
            onCancel={() => setShowSubpage(false)}
            />
        } 
        {showMypage && 
            <Mypage 
            postit = {myPostit}
            onCancel={() => setShowMypage(false)}
            onLogout={handleLogout}
            onShowEdit={() => setShowEditPage(true)}
            />
        } 
        {showEditPage &&
            <EditPage
            onCancel={() => setShowEditPage(false)}
            sex={userMe.postit.sex}
            />
        }
        {showLikeList &&
            <LikeList
            onCancel={() => setShowLikeList(false)}
            postits={postits}
            sex={userMe.postit.sex}
            onShowSubpage={(id) => handleSubpage(id)}
            />
        }

        {/* {showChat &&
            <Chat 
            
            onClose={() => setShowChat(false)} />
        } */}
        {showChat &&
            <Chat showChat={showChat} onClose={() => setShowChat(false)} postit_id = {receiver_id} postits={postits}/>
        }
        {/* <Chat showChat={showChat} onClose={() => setShowChat(false)} postit_id = {receiver_id} postits={postits}/> */}
        {postits.map(postit => (
            <div 
            key={postit.user_id} 
            className = {`rgyPostIt ${postit.sex}`}
            style={{ left: postit.x, top: postit.y}}
            onMouseDown={e => handleDragStart(e, postit.user_id)}
            onDoubleClick={e => handlePostitDoubleClick(e, postit.user_id)}
            >
            {/* <button className="close-button" onClick={() => handleDeletePostit(postit.user_id)}>X</button> */}

            {/* emogi가 1이면 cat, 2면 dog, ... (public에 이미지 순서대로 사용) */}
            <div className="myHeader">
                <img src={process.env.PUBLIC_URL + `/emoji_png/${getEmogi(postit.emogi)}.png`} alt="Emogi" style={{ width: '60px', height: '60px' }} />  
                <div>
                    <h2 style={{marginLeft: "10px"}}>{postit.name}</h2>    
                </div>  
            </div>
            <div className="myBody">
                <div>
                    <div className="infoBox">
                        <div className="infoTitle" variant="ghost">
                            MBTI
                        </div>
                        <div className="infoContent">
                            <div className={`infoItem ${postit.sex}`}>
                                {postit.mbti}
                            </div>
                        </div>
                    </div>
                    <div className="infoBox">    
                        <div className="infoTitle" variant="ghost">
                            HOBBY
                        </div>
                        <div className="infoContent">
                            {/* postit.hobby가 null이 아니면 */}
                            {postit.hobby && postit.hobby.map((item, index) => (
                                <div key={index} className={`infoItem ${postit.sex}`}>
                                    {item}
                                </div>
                            ))}
                            {/* {postit.hobby.map((item, index) => (
                                <div key={index} className={`infoItem ${postit.sex}`}>
                                    {item}
                                </div>
                            ))} */}
                        </div>
                    </div>
                </div>
            </div>
            {/* {`Insta ID : ` + postit.content_insta}<br/> */}
            {/* isLike가 true면 ❤️ false 면 🤍 */}
            <button onClick={() => handleLikeButtonClick(postit.user_id, postit.liked)} className = 'like-button'>
                {postit.liked ? <HeartFilled style={{fontSize: '20px', color: '#ff0000'}}/> : <HeartOutlined style={{fontSize: '20px'}}/>}
            </button>
            <button className={`chat-button ${postit.sex}`} onClick={() => handleChatButtonClick(postit.user_id)}><MessageOutlined style={{fontSize: '20px'}}/></button>
            </div>
        ))}

        <button className={`mypage-button ${userMe.postit.sex}`} onClick={() => {setShowMypage(true); handleMyPostit();}} >MY PAGE</button>
        <button className={`likelist-button ${userMe.postit.sex}`} onClick={() => {setShowLikeList(true)}}>My Like</button>
        {/* <button className="add-button" onClick={handleOpenSubpage}>+</button> */}
        <div className="minimap" style={{ position: 'fixed', bottom: 0, left: 0, width: '200px', height: '200px', backgroundColor: 'rgba(0, 0, 0, 0.3)', overflow: 'hidden' ,zIndex: '100'}}>
            {renderPostitPoints()}
            <div style={{ position: 'absolute', left: `${viewport.x}%`, top: `${viewport.y}%`, width: `${viewport.width}%`, height: `${viewport.height}%`, border: '2px solid red' }}></div>
        </div>
        {/* 아래 scroll-RightMargin과 scroll-LeftMargin은 모바일 화면이면 표시 안함. */}
        {shouldRenderMargins && 
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
        ></div>}
        {shouldRenderMargins && 
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
        ></div>}
            <div>
                {showMenual && <Menual onClose={handleMenualClose} />}
            </div>
            <AdComponent style={{ position: 'absolute', left: '0px', top: '55px' }}/>
            <AdComponent style={{ position: 'absolute', left: '0px', top: '1700px' }}/>
            <AdComponent style={{ position: 'absolute', right: '0px', top: '55px' }}/>
            <AdComponent style={{ position: 'absolute', right: '0px', top: '1700px' }}/>
            <span style={{ position:'absolute', top: '3360px', left: '10px', fontSize: '10px', color: 'grey'}}>"이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."</span>
        </div>
    );
}

export default App;

