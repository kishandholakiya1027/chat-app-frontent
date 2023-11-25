import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {

  const [data, setData] = useState([]);
  const auth = localStorage.getItem('token');
  const navigate = useNavigate();

  const USER_API_URL = 'http://localhost:8085/user/get_all';
  const LOGOUT_API_URL = 'http://localhost:8085/auth/logout';

  const fetchData = async () => {
    try {
      if (auth) {
        const res = await axios.post(USER_API_URL, { auth });
        if (res.data.status === 200) {
          setData(res.data.users);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      const { status } = await axios.post(LOGOUT_API_URL, { token: auth });
      if (status === 200) {
        localStorage.setItem('token', '');
        navigate('/login');
      } else {
        alert('Wrong Token.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!auth) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [auth]);

  return (
    <>
      <button onClick={handleLogout} className='logout'>LogOut</button>
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
                    <td><Link className='btn' to={`/chat?userId=${v._id}`}>Message</Link></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table >
      </div>
    </>
  );
};

export default Home;
