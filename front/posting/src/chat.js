import React, { useState, useEffect, useRef } from 'react';
import './chat.scss';

const ChatApp = ({showChat, postit_id, postits, onClose}) => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem('user_id'));
    const [chatRoomList, setChatRoomList] = useState([]);
    // const [receiver_id, setReceiverId] = useState(postit_id);
    const [receiver_id, setReceiver_id] = useState(postit_id);
    const [showWrapper, setShowWrapper] = useState(true);
    //user1과 user2중 큰 값이 앞에 오도록 두 문자열을 합침.
      //   const room = user1 > user2 ? user1 + user2 : user2 + user1;
      // const room = '65a387fbdb8db1394c635141784';
    const url = process.env.REACT_APP_SOCKET_API + userId;
    const socketRef = useRef(null);

    // console.log(`initial receiver_id : ${receiver_id}`);

    useEffect(() => {

        socketRef.current = new WebSocket(url);
        const socket = socketRef.current;

        // 보낼때 sender_id, receiver_id, text
        socket.onopen = () => {
        console.log('WebSocket connection opened');
        const userId = localStorage.getItem('user_id');
        setUserId(userId);
        //   socket.send(JSON.stringify({ type: 'join', userId: userId }));
        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log('msg.value : ', msg.value);
            // const transformedData = msg.value.map(msg => ({
            //   userId: msg.sender_id,
            //   text: msg.content
            // }));
            if (Array.isArray(msg.value)) {
                setChatRoomList(msg.value);
                console.log('chatRoomList : ', chatRoomList);
            } else {
                // setResponse({});
                // const transformedData = msg.value.map(msg => ({
                //     // const transformedData = msg.map(msg => ({
                //         userId: msg.value.sender_id,
                //         text: msg.value.content
                //     }));
                const transformedData = {
                    sender_id: null,
                    content: null
                };
                transformedData.sender_id = msg.value.sender_id;
                transformedData.content = msg.value.content;
                console.log('transformedData : ', transformedData);
                // setResponse(transformedData);
                //response에 transformedData를 추가
                // const newResponse = [...response, transformedData];
                // setResponse(newResponse);
                // setResponse((prev) => [...prev, {user_id: msg.value.sender_id, content: msg.value.text}]);
                setResponse((prev) => [...prev, transformedData]);
                console.log('type : ', typeof msg.value);
                console.log('받은게 array가 아님');
            }
            console.log('onmessage : ', response);
            // setResponse(transformedData);
        };

        return () => {
        socket.close();
        console.log('WebSocket connection closed');
        };
    }, []);

  
    const sendMessage = () => {
      // console.log({userId, message});
      socketRef.current.send(JSON.stringify({ type: 'message', sender: userId, receiver: receiver_id, text: message }));
      console.log(`receiver_id : ${receiver_id}`);
      console.log('message sent');
    };

    const handleChatList = () => {
        //chatRoomList에서 chatRoomList.room_name에 receiver_id가 포함되는 것을 찾아서 setResponse
        // console.log('chatRoomList : ', chatRoomList);
        //chatRoomList가 비지 않았으면
        if (chatRoomList.length === 0){
            console.log('chatRoomList is empty');
        } else {
            const chatRoom = chatRoomList.find(room => room.room_name.includes(receiver_id));
            console.log('chatRoom : ', chatRoom);
            if(chatRoom === undefined){
                console.log('chatRoom is undefined');
                alert('chatRoom is undefined');
                setResponse([]);
            } else {
                setResponse(chatRoom.chat_list);  
            }
        }
        // setShowWrapper(true);
        // const chatRoom = chatRoomList.find(room => room.room_name.includes(receiver_id));
        // console.log('chatRoom : ', chatRoom);
        // setResponse(chatRoom.chat_list);
    }

    useEffect(() => {
        console.log('chatRoomList : ', chatRoomList);
    }, [chatRoomList]);

    // useEffect (() => {
    //     handleChatList();
    // }, [receiver_id]);

    // useEffect (() => {
    //     setShowWrapper(true);
    // }, [showChat]);

    useEffect(() => {
        // setReceiverId(postit_id);
        handleChatList();
        // setShowWrapper(true);
    });

    // room_name을 파라미터로 받아서 내 userId를 제외한 상대방의 userId를 receiver에 저장 후, postits에서 receiver와 아이디가 일치하는 name을 반환
    const getReceiverName = (room_name) => {
        const receiver = room_name.replace(userId, '');
        // console.log('receiver : ', receiver);
        const receiverPostit = postits.find(postit => postit.user_id === receiver);
        if(receiverPostit !== undefined) {
            const receiverName = receiverPostit.name;
            console.log('receiverName : ', receiverName);
            return receiverName;
        }
    }
    const handleWrapper = () => {
        setShowWrapper(!showWrapper);
    }

    const changeReceiverId = (room_name) => {
        const receiver = room_name.replace(userId, '');
        console.log('Changed receiver_id : ', receiver);
        setReceiver_id(receiver);
        handleChatList();
    }


    // const handleChangeReceiverId = (receiver_id) => {
    //     console.log('receiver_id : ', receiver_id);


  if(!showChat) return null;

  return (
    <div>
        <div className="chat-list">
            <div className="chat-list-header">
                <h1>Chats</h1>
            </div>
            <div className="chat-list-container">
                <div className="chat-list-content">
                    <div>
                        {/* <div className="userBox">
                            <div className="userBox-content">
                                <div className="chat-list-user">이상현</div>
                                <div className="chat-list-userContent">글</div>
                            </div>
                            <div className="userBox-alert">
                                <div className="bell">❕</div>
                                <div className="time">8:33 PM</div>
                            </div>
                        </div>
                        <div className="userBox">
                            <div className="userBox-content">
                                <div className="chat-list-user">육세현</div>
                                <div className="chat-list-userContent">ㅇㅋㅇㅋ</div>
                            </div>
                            <div className="userBox-alert">
                                <div className="time">8:59 PM</div>
                            </div>
                        </div> */}
                        {chatRoomList.map((room, index) => (
                            <div key={index} className="userBox">
                                <button onClick={() => changeReceiverId(room.room_name)} className="userBox-content">
                                    <div className="chat-list-user">{getReceiverName(room.room_name)}</div>
                                    <div className="chat-list-userContent">
                                    {room.chat_list[room.chat_list.length - 1].content.length > 5 
                                        ? `${room.chat_list[room.chat_list.length - 1].content.slice(0, 5)}...` 
                                        : room.chat_list[room.chat_list.length - 1].content}
                                    </div>
                                </button>
                                <div className="userBox-alert">
                                    {/* <div className="bell"></div> */}
                                    
                                    <div className="time">
                                    {
                                        new Intl.DateTimeFormat('en', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                        }).format(new Date(room.chat_list[room.chat_list.length - 1].created_at))
                                    }
                                    </div>
                                </div>
                            </div>
                        ))}
                        

                    </div>
                </div>
            </div>
        </div>
        {/* {showWrapper && */}
            <div className="chat-wrapper">
                <div className="chat-header">
                    {/* <button className="close-button" onClick={handleWrapper}>X</button> */}
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
                <div className="chat-container">
                    <div className="chat-content">
                        <div className="chat">
                        {Array.isArray(response) && response.map((msg, index) => (
                            <div key={index} className={msg.sender_id === userId ? 'me' : 'notMe'}>
                                {msg.sender_id === userId ? (
                                    <>{msg.content} <strong>:Me</strong> </>
                                ) : (
                                    <><strong>User :</strong> {msg.content}</>
                                )}
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                <div className="input-box">
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                        <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        {/* } */}
    </div>
  );
};

export default ChatApp;
