// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Modal } from 'antd';
import styled from 'styled-components';
import axios from 'axios';
import qs from 'qs';
import { useLoginStateStore, useTokenStore } from '../store/store';
import LoginFailedModal from '../components/LoginFailedModal';

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
  text-align: right;
`;

const login = async (values) => {
  const params = qs.stringify({
    'username': values.userId,
    'password': values.password
  });

  const result = await axios.post("http://localhost:8000/login/", params);
  return result.data;
};

const LoginR = () => {
  const [visible, setVisible] = useState(true);
  const [form] = Form.useForm();
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setLoginState = useLoginStateStore((state) => state.setLoginState);
  const [loginFailedModalOpen, setLoginFailedModalOpen] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation(login, {
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data.access_token));
      setAccessToken(data.access_token);
      setLoginState(true);
      navigate('/main');
    },
    onError: () => {
      setLoginFailedModalOpen(true);
    }
  });

  const onFinish = (values) => {
    mutation.mutate(values);
  };

  const closeModal = () => {
    setLoginFailedModalOpen(false);
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
        <LoginFailedModal
          isOpen={loginFailedModalOpen} 
          onRequestClose={closeModal} 
        />
      </Form>
    </Modal>
  );
};

export default LoginR;