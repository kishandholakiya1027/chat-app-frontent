import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import io from 'socket.io-client';

const Chat = () => {

  const navigate = useNavigate();
  const auth = localStorage.getItem('token');
  const url = new URLSearchParams(window.location.search);
  const id = url.get('userId');
  const socket = io.connect('http://localhost:8085/');
  const [msg, setmsg] = useState('');
  const [chat, setChat] = useState('');

  const formEvent = (e) => {
    setmsg(e.target.value);
  }

  const fetchData2 = () => {
    socket.on('fetchData2', (data) => {
      setChat(data.data);
    })
  }

  socket.on('fetchChat', (data) => {
    setChat(data.data);
  })

  const formSubmit = async (e) => {
    e.preventDefault();

    if (msg !== '') {
      const data = {
        auth: auth,
        message: msg,
        receiverId: id
      }
      socket.emit('newChat', { data: data });
      setmsg('');
    }
  }

  useEffect(() => {
    if (!auth) {
      navigate('/login');
    }
    else {
      socket.emit('fetchData', { receiverId: id, auth: auth });
      fetchData2();
    }

  }, [])

  return (
    <>
      <div className='container'>
        <div className='chat-container'>
          <ul style={{ listStyle: 'none' }}>
            {
              chat.length !== 0 && chat.map((v, i) => {
                if (v.senderId === id) {
                  return (
                    <li key={i} style={{ textAlign: "end" }}><p>{v.message}</p></li>
                  )
                }
                else {
                  return (
                    <li key={i}><p>{v.message}</p></li>
                  )
                }
              })
            }
          </ul>
        </div>
        <form method='post' onSubmit={formSubmit}>
          <input type="text" className='form-control' value={msg} placeholder='Message here....' onChange={formEvent} />
          {/* <button type='button'  >Submit</button> */}
        </form>
      </div>
    </>
  )
}

export default Chat;