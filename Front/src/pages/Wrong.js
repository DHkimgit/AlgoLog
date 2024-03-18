import React, {useEffect} from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenAtom } from '../recoil/token'; // accessTokenAtom import
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import userNameAtom from '../recoil/username';
import userEmailAtom from '../recoil/email';
import TopNav from '../components/TopNav';
import SideBar from '../components/SideBar';
import bojIdAtom from '../recoil/bojid';

const Maincontainer = styled.div`
    display: flex;
`

const Wrong = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [userName, setUserName] = useRecoilState(userNameAtom);
  const [userEmail, setUserEmail] = useRecoilState(userEmailAtom);
  const [bojId, setBojId] = useRecoilState(bojIdAtom);


  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem('user');
      const token_request = JSON.parse(token);
      if (token_request) {
          setAccessToken(token_request);
      }

      if (accessToken) {
          axios.get("http://localhost:8000/login/me", {
              headers: {
                  Authorization: `Bearer ${accessToken}`
              }
          })
          .then(result => {
              setUserName(result.data.name);
              setUserEmail(result.data.email);
              setBojId(result.data.bojid);
          })
      }
  })

  function Click_Debug(){
      console.log(userName)
      console.log(userEmail)
      console.log(accessToken)
  };

  return (
    <>
      <TopNav></TopNav>
      <Maincontainer>
        <SideBar menu={'틀린 문제'}/>
        <div>{userName}</div>
        <button onClick={Click_Debug}>확인</button>
      </Maincontainer>
    </>
  );
};
export default Wrong;