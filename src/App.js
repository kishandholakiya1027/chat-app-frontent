import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'

function App() {
  return (
    <Routes>
      <Route path='/' Component={Home} />
      <Route path='/login' Component={Login} />
      <Route path='/register' Component={Register} />
      <Route path='/chat' Component={Chat} />
    </Routes>
  );
}

export default App;
