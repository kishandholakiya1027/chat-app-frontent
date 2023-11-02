import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import io from 'socket.io-client';

const Home = () => {

  const [data, setData] = useState([]);
  const auth = localStorage.getItem('token');
  const socket = io.connect('http://localhost:8085/');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      if (auth) {
        const res = await axios.post('http://localhost:8085/user/get_all', { auth });
        if (res.data.status === 200) {
          setData(res.data.users);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const Logout = () => {
    localStorage.setItem('token', '');
    navigate('/login');
  }

  useEffect(() => {
    if (!auth) {
      navigate('/login');
    }
    else {
      fetchData();
    }
  }, [auth]);

  return (
    <>
      <button onClick={Logout} className='logout'>LogOut</button>
      <div className='container'>
        <table border={1}>
          <thead>
            <tr>
              <th>name</th>
              <th>email</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {
              data.length !== 0 && data.map((v, i) => {
                return (
                  <tr key={i}>
                    <td>{v.username}</td>
                    <td>{v.email}</td>
                    <td><a href={`/chat?userId=${v._id}`}>Message</a></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table >
      </div>
    </>
  )
}

export default Home;