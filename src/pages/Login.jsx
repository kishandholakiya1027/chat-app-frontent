import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8085/auth/login';
  const initialData = {
    email: "",
    password: "",
  };

  const [data, setData] = useState(initialData);
  const [dataError, setDataError] = useState(initialData);
  const auth = localStorage.getItem('token');

  const validateField = (name, value, setDataError) => {
    if (value === "") {
      setDataError(prev => ({ ...prev, [name]: "This Field is Required!" }));
    } else {
      if (name === 'email' && !value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        setDataError(prev => ({ ...prev, [name]: "Please Enter a Valid Email" }));
      } else {
        setDataError(prev => ({ ...prev, [name]: "" }));
      }
    }
  };

  const formEvent = ({ target: { name, value } }) => {
    setData(prev => ({ ...prev, [name]: value }));
    validateField(name, value, setDataError);
  };

  const formSubmit = async () => {
    if (dataError.email === "" && dataError.password === "" && data.email !== "" && data.password !== "") {
      try {
        const res = await axios.post(API_URL, data);
        if (res.data.status === 200) {
          localStorage.setItem('token', res.data.data.access_token);
          localStorage.setItem('userId', res.data.data.id);
          navigate('/');
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    } else {
      if (data.email === "") {
        setDataError(prev => ({ ...prev, email: "This Field is Required!" }));
      }
      if (data.password === "") {
        setDataError(prev => ({ ...prev, password: "This Field is Required!" }));
      }
    }
  };

  useEffect(() => {
    if (auth) {
      navigate('/');
    }
  }, [auth]);

  return (
    <div>
      <form method='post' className='form'>
        <h2>Login Form</h2>
        <div className='input-box'>
          <label htmlFor="email">Email</label>
          <input type="text" name='email' id='email' value={data.email} onChange={formEvent} placeholder='Email' />
          {dataError.email && <p style={{ color: "#ff0000", fontSize: "12px" }}>{dataError.email}</p>}
        </div>
        <div className='input-box'>
          <label htmlFor="password">Password</label>
          <input type="password" name='password' id='password' value={data.password} onChange={formEvent} placeholder='Password' />
          {dataError.password && <p style={{ color: "#ff0000", fontSize: "12px" }}>{dataError.password}</p>}
        </div>
        <div className='submitbtn'>
          <button type='button' onClick={formSubmit} >Login</button>
        </div>
        {auth ? null : <Link to="/register">Register</Link>}
      </form>
    </div>
  );
};

export default Login;