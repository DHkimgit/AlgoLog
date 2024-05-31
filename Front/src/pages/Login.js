import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { Form, Input, Button, Modal, Typography  } from 'antd';
import { accessTokenAtom } from '../recoil/token';
import loginStateAtom from '../recoil/login';

var stringify = require('qs-stringify');

const TextLogin = styled.p`
    font-family: 'Noto Sans KR', sans-serif;
    margin-bottom: 8px;
    font-size: 15px;
    font-weight: bold;
`;

const TextRegister = styled.p`
    font-family: 'Noto Sans KR', sans-serif;
    margin-bottom: 8px;
    font-size: 14px;
`;

const Title = styled.p`
    font-family: 'Noto Sans KR', sans-serif;
    margin-bottom: 8px;
    font-size: 33px;
    font-weight: bold;
`;

const Register = styled.div`
    text-align: right
`;


const Login = () => {
  const [visible, setVisible] = useState(true);
  const [form] = Form.useForm();
  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const [loginstate, setLoginState] = useRecoilState(loginStateAtom);
  const [validData, setValidData] = useState(true);
  const navigate = useNavigate();

  const onFinish = (values) => {
    const params = stringify({
        'username': values.userId,
        'password': values.password
    });
    
    axios.post("http://localhost:8000/login/", params)
    .then(result => {
        console.log(result.status);
        if (result.status === 200){
            console.log(result.data);
            localStorage.setItem('user', JSON.stringify(result.data.access_token));
            setAccessToken(result.data.access_token);
            setLoginState(true);
            console.log(result.data.access_token)
            navigate('/main');
        }
        else{
            setValidData(false);
        }
    })
    console.log('Received values:', values);
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      centered
      maskClosable={false}
    >
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        initialValues={{ remember: true }}
      >
        <Form.Item style={{ textAlign: 'center' }}><Title>AlgoLog</Title></Form.Item>
        <TextLogin>아이디</TextLogin>
        <Form.Item
          name="userId"
          rules={[{ required: true, message: '아이디를 입력해주세요 !' }]}
        >
          <Input placeholder="User ID" size="large" />
        </Form.Item>
        <TextLogin>비밀번호</TextLogin>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '비밀번호를 입력해주세요 !' }]}
        >
          <Input.Password placeholder="Password" size="large"/>
        </Form.Item>
        <Register><Link to="/register"><TextRegister>회원가입</TextRegister></Link></Register>
        <br />
        <Form.Item>
          <Button type="primary" htmlType="submit" block size='large'>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Login;