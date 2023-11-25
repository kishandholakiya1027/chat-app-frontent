import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const initialData = {
    username: "",
    email: "",
    password: "",
    cpassword: ""
  }

  const [data, setData] = useState(initialData);
  const [dataError, setDataError] = useState(initialData);

  const formEvent = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    if (name === 'username') {
      setDataError((prev) => ({ ...prev, [name]: value === "" ? "This Field is Required!" : "" }));
    } else if (name === 'email') {
      setDataError((prev) => ({
        ...prev,
        [name]: value === "" ? "This Field is Required!" : !value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ? "Please Enter a Valid Email" : ""
      }));
    } else if (name === 'password') {
      setDataError((prev) => ({ ...prev, [name]: value === "" ? "This Field is Required!" : "" }));
    } else if (name === 'cpassword') {
      setDataError((prev) => ({
        ...prev,
        [name]: value === "" ? "This Field is Required!" : data.password !== value ? "Password and Confirm Password Do Not Match!" : ""
      }));
    }
  }

  const formSubmit = async (e) => {
    e.preventDefault();

    if (dataError.username === "" && dataError.email === "" && dataError.password === "" && dataError.cpassword === "" && data.username !== "" && data.email !== "" && data.password !== "" && data.cpassword !== "") {
      try {
        const res = await axios.post('http://localhost:8085/auth/register', data);
        if (res.data.status === 200) {
          navigate('/login');
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      if (data.username === "") {
        setDataError((prev) => ({ ...prev, username: "This Field is Required!" }));
      }
      if (data.email === "") {
        setDataError((prev) => ({ ...prev, email: "This Field is Required!" }));
      }
      if (data.password === "") {
        setDataError((prev) => ({ ...prev, password: "This Field is Required!" }));
      }
    }
  }

  return (
    <div>
      <form method='post' className='form' onSubmit={formSubmit}>
        <h2>Register Form</h2>
        {renderInput('username', 'Username')}
        {renderInput('email', 'Email')}
        {renderInput('password', 'Password', 'password')}
        {renderInput('cpassword', 'Confirm Password', 'password')}
        <div className='submitbtn'>
          <button type='submit'>Register</button>
        </div>
        <Link to="/login">Login</Link>
      </form>
    </div>
  );

  function renderInput(name, label, type = 'text') {
    return (
      <div className='input-box' key={name}>
        <label htmlFor={name}>{label}</label>
        <input
          type={type}
          name={name}
          id={name}
          value={data[name]}
          onChange={formEvent}
          placeholder={label}
        />
        {dataError[name] !== "" && <p style={{ color: "#ff0000", fontSize: "12px" }}>{dataError[name]}</p>}
      </div>
    );
  }
}

export default Register;
