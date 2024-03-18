import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import { RecoilRoot } from 'recoil';
import Solved from './pages/Solved';
import Wrong from './pages/Wrong';
import Solutions from './pages/Solutions';
import QandA from './pages/QandA';

function App() {
  return (
    <RecoilRoot>
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/main" element={<Main/>}></Route>
        <Route path='/solved' element={<Solved/>}></Route>
        <Route path='/wrong' element={<Wrong/>}></Route>
        <Route path='/solutions' element={<Solutions/>}></Route>
        <Route path='/qanda' element={<QandA/>}></Route>
      </Routes>
    </RecoilRoot>
  );
}

export default App;
