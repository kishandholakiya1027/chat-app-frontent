import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const initialData = {
  username: "",
  email: "",
  password: "",
  cpassword: ""
}

const Register = () => {

  const navigate = useNavigate();
  const [data, setData] = useState(initialData);
  const [dataError, setDataError] = useState(initialData);

  const formEvent = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))

    if (name === 'username') {
      if (value === "") {
        setDataError(prev => ({ ...prev, [name]: "This Field are Require!" }))
      } else {
        setDataError(prev => ({ ...prev, [name]: "" }))
      }
    }
    if (name === 'email') {
      if (value === "") {
        setDataError(prev => ({ ...prev, [name]: "This Field are Require!" }))
      } else if (!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        setDataError(prev => ({ ...prev, [name]: "Please Enter Valid Email" }))
      } else {
        setDataError(prev => ({ ...prev, [name]: "" }))
      }
    }
    if (name === 'password') {
      if (value === "") {
        setDataError(prev => ({ ...prev, [name]: "This Field are Require!" }))
      } else {
        setDataError(prev => ({ ...prev, [name]: "" }))
      }
    }
    if (name === 'cpassword') {
      if (value === "") {
        setDataError(prev => ({ ...prev, [name]: "This Field are Require!" }))
      } else {
        if (data.password === value) {
          setDataError(prev => ({ ...prev, [name]: "" }))
        } else {
          setDataError(prev => ({ ...prev, [name]: "Password and Confirm Password Not Match!" }))
        }
      }
    }
  }

  const formSubmit = async () => {
    if (dataError.username === "" && dataError.email === "" && dataError.password === "" && dataError.cpassword === "" && data.username !== "" && data.email !== "" && data.password !== "" && data.cpassword !== "") {
      const res = await axios.post('http://localhost:8085/auth/register', data);
      if (res.data.status === 200) {
        navigate('/login');
      }
      else {
        alert(res.data.message);
      }
    } else {
      if (data.username === "") {
        setDataError(prev => ({ ...prev, username: "This Field are Require!" }))
      }
      if (data.email === "") {
        setDataError(prev => ({ ...prev, email: "This Field are Require!" }))
      }
      if (data.password === "") {
        setDataError(prev => ({ ...prev, password: "This Field are Require!" }))
      }
    }
  }
  return (
    <div>
      <form method='post' className='form'>
        <h2>Register Form</h2>
        <div className='input-box'>
          <label htmlFor="username">Username</label>
          <input type="text" name='username' id='username' value={data.username} onChange={formEvent} placeholder='Username' />
          {
            dataError.username !== "" && <p style={{ color: "#ff0000", fontSize: "12px" }}>{dataError.username}</p>
          }
        </div>
        <div className='input-box'>
          <label htmlFor="email">Email</label>
          <input type="text" name='email' id='email' value={data.email} onChange={formEvent} placeholder='Email' />
          {
            dataError.email !== "" && <p style={{ color: "#ff0000", fontSize: "12px" }}>{dataError.email}</p>
          }
        </div>
        <div className='input-box'>
          <label htmlFor="password">Password</label>
          <input type="text" name='password' id='password' value={data.password} onChange={formEvent} placeholder='Password' />
          {
            dataError.password !== "" && <p style={{ color: "#ff0000", fontSize: "12px" }}>{dataError.password}</p>
          }
        </div>
        <div className='input-box'>
          <label htmlFor="cpassword">Confirm Password</label>
          <input type="text" name='cpassword' id='cpassword' value={data.cpassword} onChange={formEvent} placeholder='Confirm Password' />
          {
            dataError.cpassword !== "" && <p style={{ color: "#ff0000", fontSize: "12px" }}>{dataError.cpassword}</p>
          }
        </div>
        <div className='submitbtn'>
          <button type='button' onClick={formSubmit} >Register</button>
        </div>
        <Link to="/login">Login</Link>
      </form>
    </div>
  )
}

export default Register;