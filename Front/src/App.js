import './App.css';
import { Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import { RecoilRoot } from 'recoil';
import Solved from './pages/Solved';
import Wrong from './pages/Wrong';
import Solutions from './pages/Solutions';
import QandA from './pages/QandA';
import ProblemComment from './pages/ProblemComment';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginRedirect from './components/LoginRedirect';
import LoginR from './pages/LoginR';

const queryClient = new QueryClient();

function App() {

  return (
    
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<LoginRedirect/>} />
          <Route path="/login" element={<Login/>}></Route>
          <Route path='/loginnew' element={<LoginR/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/main" element={<Main/>}></Route>
          <Route path='/solved' element={<Solved/>}></Route>
          <Route path='/wrong' element={<Wrong/>}></Route>
          <Route path='/solutions' element={<Solutions/>}></Route>
          <Route path='/qanda/' element={<QandA/>}></Route>
          <Route path='/qanda/:id' element={<ProblemComment/>}></Route>
        </Routes>
        </QueryClientProvider>
      </RecoilRoot>

  );
}

export default App;
