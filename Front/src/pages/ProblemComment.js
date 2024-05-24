import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenAtom } from '../recoil/token'; // accessTokenAtom import
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import userNameAtom from '../recoil/username';
import userEmailAtom from '../recoil/email';
import TopNav from '../components/TopNav';
import SideBar from '../components/SideBar';
import bojIdAtom from '../recoil/bojid';
import ProblemStateAtom from '../recoil/problem';
import Problem from '../components/Problem';

const Maincontainer = styled.div`
    display: flex;
`

const ProblemComment = ({problemid}) => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [userName, setUserName] = useRecoilState(userNameAtom);
  const [userEmail, setUserEmail] = useRecoilState(userEmailAtom);
  const [problemData, setProblemData] = useRecoilState(ProblemStateAtom);
  const [bojId, setBojId] = useRecoilState(bojIdAtom);
  const {id} = useParams();

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
      <Maincontainer>
        <Problem id = {problemid} />
      </Maincontainer>
    </>
  );
};
export default ProblemComment;