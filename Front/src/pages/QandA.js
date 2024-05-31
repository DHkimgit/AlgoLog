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

const QandA = () => {
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

//   useEffect(() => {
//     console.log(id)
//     if (accessToken) {
//       axios.get(`http://localhost:8000/comment/page/${id}`)
//       .then(result => {
//         console.log(result.data);
//         setProblemData(result.data);
//       }).catch(error => {
//         console.error(error);
//       });
//   }
// }, [accessToken, id])


  function Click_Debug(){
      console.log(userName)
      console.log(userEmail)
      console.log(accessToken)
  };

  return (
    <>
      <TopNav></TopNav>
      <Maincontainer>
        <SideBar menu={'Q & A'}/>
        <Problem id={id} />
      </Maincontainer>
    </>
  );
};
export default QandA;

const problemData1 = {
  "problem": {
    "_id": "65f5d19f263d6291ec1e95f9",
    "problemid": 1000,
    "title": "1000번: A+B",
    "percentage": "39.278%",
    "tiers": "Bronze V",
    "tags": [
      "구현",
      "사칙연산",
      "수학"
    ]
  },
  "comments": [
    {
      "_id": "65f86a3a3357985cec867923",
      "problemid": "65f5d19f263d6291ec1e95f9",
      "userid": "65f5d1ca263d6291ec1e964d",
      "comment": "간단한 더하기 문제라서 쉬워용",
      "up": 0,
      "down": 0
    },
    {
      "_id": "664d9bb59ff433183ff26a05",
      "problemid": "65f5d19f263d6291ec1e95f9",
      "userid": "664d96373bf6992fbb1d5d3b",
      "comment": "눈감고도 품 ㄹㅇ",
      "up": 0,
      "down": 0
    }
  ]
};