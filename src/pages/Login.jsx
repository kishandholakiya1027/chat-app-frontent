import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

const initialData = {
  email: "",
  password: "",
}

const Login = () => {

  const navigate = useNavigate();
  const [data, setData] = useState(initialData);
  const [dataError, setDataError] = useState(initialData);
  const auth = localStorage.getItem('token');

  const formEvent = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))

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
  }

  const formSubmit = async () => {
    if (dataError.email === "" && dataError.password === "" && data.email !== "" && data.password !== "") {
      const res = await axios.post('http://localhost:8085/auth/login', data);
      if (res.data.status === 200) {
        localStorage.setItem('token', res.data.data.access_token);
        navigate('/');
      }
      else {
        alert(res.data.message);
      }
    } else {
      if (data.email === "") {
        setDataError(prev => ({ ...prev, email: "This Field are Require!" }))
      }
      if (data.password === "") {
        setDataError(prev => ({ ...prev, password: "This Field are Require!" }))
      }
    }
  }

  useEffect(() => {
    if (auth) {
      navigate('/');
    }
  }, [auth]);

  return (
    <div>
      <h2>Login Form</h2>
      <form method='post'>
        {/* <div>
          <label htmlFor="username">Username</label>
          <input type="text" name='username' id='username' value={data.username} onChange={formEvent} placeholder='Username' />
          {
            dataError.username !== "" && <p style={{ color: "#ff0000", fontSize: "12px" }}>{dataError.username}</p>
          }
        </div> */}
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" name='email' id='email' value={data.email} onChange={formEvent} placeholder='Email' />
          {
            dataError.email !== "" && <p style={{ color: "#ff0000", fontSize: "12px" }}>{dataError.email}</p>
          }
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="text" name='password' id='password' value={data.password} onChange={formEvent} placeholder='Password' />
          {
            dataError.password !== "" && <p style={{ color: "#ff0000", fontSize: "12px" }}>{dataError.password}</p>
          }
        </div>
        {/* <div>
          <label htmlFor="cpassword">Confirm Password</label>
          <input type="text" name='cpassword' id='cpassword' value={data.cpassword} onChange={formEvent} placeholder='Confirm Password' />
          {
            dataError.cpassword !== "" && <p style={{ color: "#ff0000", fontSize: "12px" }}>{dataError.cpassword}</p>
          }
        </div> */}
      </form>
      <div>
        <button type='button' onClick={formSubmit} >Login</button>
      </div>
    </div>
  )
}

export default Login;