import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const BACKEND_URL = 'http://localhost:8085/';

const Chat = () => {
  const auth = localStorage.getItem('token');
  const loginUserId = localStorage.getItem('userId');
  const url = new URLSearchParams(window.location.search);
  const id = url.get('userId');
  const [msg, setMsg] = useState('');
  const [data, setData] = useState('');
  const [chat, setChat] = useState([]);
  let socket;

  useEffect(() => {
    socket = io.connect(BACKEND_URL);

    const fetchData = async () => {
      try {
        if (auth) {
          const res = await axios.get(BACKEND_URL + 'user/get/' + id);
          if (res.data.status === 200) {
            setData(res.data.user);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchData2 = async () => {
      try {
        const res = await axios.post(BACKEND_URL + 'chat/get', { senderId: loginUserId, receiverId: id });
        if (res.data.status === 200) {
          setChat(res.data.chats);
        } else {
          setChat([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchData2();

    socket.on("message recieved", (newMessageReceived) => {
      setChat((prevChat) => [...prevChat, newMessageReceived]);
    });

    return () => {
      socket.disconnect();
    };
  }, [auth, id]);

  const formSubmit = async (e) => {
    e.preventDefault();

    if (msg !== '') {
      const data = {
        senderId: loginUserId,
        message: msg,
        receiverId: id,
      };

      try {
        const res = await axios.post(BACKEND_URL + 'chat/add', data);
        if (res.status === 200) {
          socket.emit('new message', data);
          setChat((prevChat) => [...prevChat, data]);
          setMsg('');
        } else {
          alert('Message not sent');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className='container'>
        <div className='head'>
          <h2 style={{ textTransform: 'capitalize' }}>{data.username}</h2>
          <Link to="/" className='btn'>
            Back
          </Link>
        </div>
        <div className='chat-container'>
          <ul style={{ listStyle: 'none' }}>
            {chat.length !== 0 &&
              chat.map((v, i) => (
                <li key={i} style={{ textAlign: v.senderId === id ? 'start' : 'end' }}>
                  <p>{v.message}</p>
                </li>
              ))}
          </ul>
        </div>
        <form method='post' onSubmit={formSubmit} style={{ marginBottom: '10px' }}>
          <input type='text' className='form-control' value={msg} placeholder='Message here....' onChange={(e) => setMsg(e.target.value)} />
        </form>
      </div>
    </>
  );
};

export default Chat;
