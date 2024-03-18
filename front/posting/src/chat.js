import React, { useState, useEffect, useRef } from 'react';
import './chat.scss';

const ChatApp = ({showChat, postit_id}) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));
  const [chatRoomList, setChatRoomList] = useState([]);
//   const user1 = localStorage.getItem('user_id');
  const receiver_id = postit_id;
  //user1과 user2중 큰 값이 앞에 오도록 두 문자열을 합침.
    //   const room = user1 > user2 ? user1 + user2 : user2 + user1;
    // const room = '65a387fbdb8db1394c635141784';
  const url = process.env.REACT_APP_SOCKET_API + userId;
  const socketRef = useRef(null);
    // console.log('room : ', room);
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
        const transformedData = {
            userId: null,
            text: null
        };
        if (Array.isArray(msg.value)) {
        // if (typeof msg.value === 'object') {
            // const transformedData = msg.value.map(msg => ({
            // // const transformedData = msg.map(msg => ({
            //     userId: msg.value.sender_id,
            //     text: msg.value.content
            // }));
            // setResponse(transformedData);
        } else {
            // setResponse({});
            // const transformedData = msg.value.map(msg => ({
            //     // const transformedData = msg.map(msg => ({
            //         userId: msg.value.sender_id,
            //         text: msg.value.content
            //     }));
            transformedData.userId = msg.value.sender_id;
            transformedData.text = msg.value.content;
            setResponse(transformedData);
            console.log('type : ', typeof msg.value);
            // console.log('받은게 array가 아님');
        }
        console.log('onmessage : ', transformedData);
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
    console.log('message sent');
  };

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
                        <div className="userBox">
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
                                {/* <div className="bell"></div> */}
                                <div className="time">8:59 PM</div>
                            </div>
                        </div>
                        <div className="userBox">
                            <div className="userBox-content">
                                <div className="chat-list-user">육세현</div>
                                <div className="chat-list-userContent">ㅇㅋㅇㅋ</div>
                            </div>
                            <div className="userBox-alert">
                                {/* <div className="bell"></div> */}
                                <div className="time">8:59 PM</div>
                            </div>
                        </div>
                        <div className="userBox">
                            <div className="userBox-content">
                                <div className="chat-list-user">육세현</div>
                                <div className="chat-list-userContent">ㅇㅋㅇㅋ</div>
                            </div>
                            <div className="userBox-alert">
                                {/* <div className="bell"></div> */}
                                <div className="time">8:59 PM</div>
                            </div>
                        </div>
                        <div className="userBox">
                            <div className="userBox-content">
                                <div className="chat-list-user">육세현</div>
                                <div className="chat-list-userContent">ㅇㅋㅇㅋ</div>
                            </div>
                            <div className="userBox-alert">
                                {/* <div className="bell"></div> */}
                                <div className="time">8:59 PM</div>
                            </div>
                        </div>
                        <div className="userBox">
                            <div className="userBox-content">
                                <div className="chat-list-user">육세현</div>
                                <div className="chat-list-userContent">ㅇㅋㅇㅋ</div>
                            </div>
                            <div className="userBox-alert">
                                {/* <div className="bell"></div> */}
                                <div className="time">8:59 PM</div>
                            </div>
                        </div>
                        <div className="userBox">
                            <div className="userBox-content">
                                <div className="chat-list-user">육세현</div>
                                <div className="chat-list-userContent">ㅇㅋㅇㅋ</div>
                            </div>
                            <div className="userBox-alert">
                                {/* <div className="bell"></div> */}
                                <div className="time">8:59 PM</div>
                            </div>
                        </div>
                        <div className="userBox">
                            <div className="userBox-content">
                                <div className="chat-list-user">육세현</div>
                                <div className="chat-list-userContent">ㅇㅋㅇㅋ</div>
                            </div>
                            <div className="userBox-alert">
                                {/* <div className="bell"></div> */}
                                <div className="time">8:59 PM</div>
                            </div>
                        </div>
                        <div className="userBox">
                            <div className="userBox-content">
                                <div className="chat-list-user">육세현</div>
                                <div className="chat-list-userContent">ㅇㅋㅇㅋ</div>
                            </div>
                            <div className="userBox-alert">
                                {/* <div className="bell"></div> */}
                                <div className="time">8:59 PM</div>
                            </div>
                        </div>
                        <div className="userBox">
                            <div className="userBox-content">
                                <div className="chat-list-user">육세현</div>
                                <div className="chat-list-userContent">ㅇㅋㅇㅋ</div>
                            </div>
                            <div className="userBox-alert">
                                {/* <div className="bell"></div> */}
                                <div className="time">8:59 PM</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div className="chat-wrapper">
            <div className="chat-container">
                <div className="chat-content">
                    <div className="chat">
                    {Array.isArray(response) && response.map((msg, index) => (
                        <div key={index} className={msg.userId === userId ? 'me' : 'notMe'}>
                            {msg.userId === userId ? (
                                <>{msg.text} <strong>:Me</strong> </>
                            ) : (
                                <><strong>User :</strong> {msg.text}</>
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
