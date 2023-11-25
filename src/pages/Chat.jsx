import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
var socket;
const BACKEND_URL = 'http://localhost:8085/';

const Chat = () => {

  const auth = localStorage.getItem('token');
  const loginUserId = localStorage.getItem('userId');
  const url = new URLSearchParams(window.location.search);
  const id = url.get('userId');
  const [msg, setmsg] = useState('');
  const [data, setData] = useState('');
  const [chat, setChat] = useState([]);

  const formSubmit = async (e) => {
    e.preventDefault();

    if (msg !== '') {
      const data = {
        senderId: loginUserId,
        message: msg,
        receiverId: id
      }
      const res = await axios.post(BACKEND_URL + 'chat/add', data);

      if (res.status === 200) {
        socket.emit("new message", data);
        setChat([...chat, data]);
        setmsg('');
      }
      else {
        alert("message not send");
      }
    }
  }

  const fetchData = async () => {
    try {
      if (auth) {
        const res = await axios.get(BACKEND_URL + 'user/get/' + id);
        if (res.data.status === 200) {
          setData(res.data.user);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchData2 = async () => {
    try {
      const res = await axios.post(BACKEND_URL + 'chat/get', { senderId: loginUserId, receiverId: id });
      if (res.data.status === 200) {
        setChat(res.data.chats);
      }
      else {
        setChat([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    socket = io.connect(BACKEND_URL);

    fetchData();
    fetchData2();
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      setChat([...chat, newMessageRecieved]);
    });
  });

  return (
    <>
      <div className='container'>
        <div className='head'>
          <h2 style={{ textTransform: 'capitalize' }}>{data.username}</h2>
          <Link to="/" className='btn'>Back</Link>
        </div>
        <div className='chat-container'>
          <ul style={{ listStyle: 'none' }}>
            {
              chat.length !== 0 && chat.map((v, i) => {
                if (v.senderId === id) {
                  return (
                    <li key={i}><p>{v.message}</p></li>
                  )
                }
                else {
                  return (
                    <li key={i} style={{ textAlign: "end" }}><p>{v.message}</p></li>
                  )
                }
              })
            }
          </ul>
        </div>
        <form method='post' onSubmit={formSubmit} style={{ marginBottom: '10px' }}>
          <input type="text" className='form-control' value={msg} placeholder='Message here....' onChange={(e) => setmsg(e.target.value)} />
        </form>
      </div>
    </>
  )
}

export default Chat;