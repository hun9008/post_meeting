import React, { useState, useEffect, useRef } from 'react';
import './chat.scss';

const ChatApp = ({showChat, postit_id, postits, onClose}) => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem('user_id'));
    const [chatRoomList, setChatRoomList] = useState([]);
    const [receiver_id, setReceiver_id] = useState(postit_id);
    const [showWrapper, setShowWrapper] = useState(true);
    //user1과 user2중 큰 값이 앞에 오도록 두 문자열을 합침.
    const url = process.env.REACT_APP_SOCKET_API + userId;
    const shouldRender = window.innerWidth > 768 ? true : false;
    const socketRef = useRef(null);

    useEffect(() => {

        socketRef.current = new WebSocket(url);
        const socket = socketRef.current;

        // 보낼때 sender_id, receiver_id, text
        socket.onopen = () => {
        // console.log('WebSocket connection opened');
        const userId = localStorage.getItem('user_id');
        setUserId(userId);
        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            // console.log('msg.value : ', msg.value);
            if (Array.isArray(msg.value)) {
                setChatRoomList(msg.value);
                // console.log('chatRoomList : ', chatRoomList);
            } else {
                const transformedData = {
                    sender_id: null,
                    content: null,
                    created_at: null,
                };
                transformedData.sender_id = msg.value.sender_id;
                transformedData.content = msg.value.content;
                transformedData.created_at = msg.value.created_at;
                // console.log('transformedData : ', transformedData);
                setResponse((prev) => [...prev, transformedData]);
                // console.log('response : ', response);
                // console.log('type : ', typeof msg.value);
                // console.log('받은게 array가 아님');
            }
            // console.log('onmessage : ', response);
            
        };

        return () => {
        socket.close();
        // console.log('WebSocket connection closed');
        };
    }, []); ///

  
    const sendMessage = () => {
      socketRef.current.send(JSON.stringify({ type: 'message', sender: userId, receiver: receiver_id, text: message }));
    //   console.log(`receiver_id : ${receiver_id}`);
    //   console.log('message sent');
    };

    const handleChatList = () => {
        if (chatRoomList.length === 0){
            // console.log('chatRoomList is empty');
        } else {
            // console.log('check response : ', response);
            if(response.length == 0){
                // console.log(`find Id in chatroom : ${receiver_id}`);
                const chatRoom = chatRoomList.find(room => room.room_name.includes(receiver_id));
                // console.log('chatRoom : ', chatRoom);
                if(chatRoom === undefined){
                    const newChatRoomList = [...chatRoomList];
                    const room = userId > receiver_id ? userId + receiver_id : userId + receiver_id;
                    const addedChatRoomList = {room_name: room, chat_list: []};
                    newChatRoomList.push(addedChatRoomList);
                    setChatRoomList(newChatRoomList);
                    // console.log('chatRoomList : chatRoom is undefined');
                    setResponse([]);
                } else {
                    setResponse(chatRoom.chat_list); 
                }
            }
        }
    }

    useEffect(() => {
        // console.log('chatRoomList : ', chatRoomList);
        // console.log('response change detected : ', response);
    }, [response]);

    useEffect(() => {

        // console.log('first receiver_id : ', receiver_id);
        handleChatList();
    });

    // room_name을 파라미터로 받아서 내 userId를 제외한 상대방의 userId를 receiver에 저장 후, postits에서 receiver와 아이디가 일치하는 name을 반환
    const getReceiverName = (room_name) => {
        if(room_name === undefined) return '상대가 채팅방에서 나갔습니다.';
        const receiver = room_name.replace(userId, '');
        const receiverPostit = postits.find(postit => postit.user_id === receiver);
        if(receiverPostit !== undefined) {
            const receiverName = receiverPostit.name;
            // console.log('receiverName : ', receiverName);
            return receiverName;
        }
    }

    const changeReceiverId = (room_name) => {
        const receiver = room_name.replace(userId, '');
        // console.log('Changed receiver_id : ', receiver);
        const newChatRoomList = [...chatRoomList];
        newChatRoomList.chat_list = Array.isArray(newChatRoomList.chat_list) ? [...newChatRoomList.chat_list, response] : [response];
        setChatRoomList(newChatRoomList);
        setReceiver_id(receiver);
        // console.log('!!receiver_id : ', receiver_id);
        if (chatRoomList.length === 0){
            // console.log('chatRoomList is empty');
        } else {
            // console.log('check response : ', response);

            // console.log(`find Id in chatroom : ${receiver_id}`);
            const chatRoom = chatRoomList.find(room => room.room_name.includes(receiver));
            // console.log('chatRoom : ', chatRoom);
            if(chatRoom === undefined){
                // console.log('chatRoom is undefined');
                alert('chatRoom is undefined');
                setResponse([]);
            } else {
                setResponse(chatRoom.chat_list);  
            }
        
        }
        setMessage('');
    }


  if(!showChat) return null;

  return (
    <div>
        {shouldRender && (
            <div className="chat-list">
                <div className="chat-list-header">
                    <h1>Chats</h1>
                </div>
                <div className="chat-list-container">
                    <div className="chat-list-content">
                        <div>
                            {chatRoomList.map((room, index) => (
                                <div key={index} className="userBox">
                                    { room.chat_list.length != 0 &&
                                    <button onClick={() => changeReceiverId(room.room_name)} className="userBox-content">
                                        <div className="chat-list-user">{getReceiverName(room.room_name)}</div>
                                        <div className="chat-list-userContent">
                                        {room.chat_list[room.chat_list.length - 1].content.length > 5 
                                            ? `${room.chat_list[room.chat_list.length - 1].content.slice(0, 5)}...` 
                                            : room.chat_list[room.chat_list.length - 1].content}
                                        </div>
                                    </button>}
                                    { room.chat_list.length != 0 &&
                                    <div className="userBox-alert">
                                        
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
                                    </div>}
                                </div>
                            ))}
                            

                        </div>
                    </div>
                </div>
            </div>
        )}
            <div className="chat-wrapper">
                <div className="chat-header">
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
                                    <><strong>{getReceiverName(msg.sender_id)} :</strong> {msg.content}</>
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
    </div>
  );
};

export default ChatApp;
