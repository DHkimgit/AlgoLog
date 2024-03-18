import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Form, Input, Button, Modal, Typography  } from 'antd';

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

const Logintext = styled.div`
    text-align: right
`;

const Register = () => {
    const [visible, setVisible] = useState(true);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Received values:', values);
        // Perform login logic here
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
          <Form.Item style={{ textAlign: 'center' }}><Title>회원가입</Title></Form.Item>
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
          <TextLogin>백준 온라인 저지 아이디</TextLogin>
          <Form.Item
            name="bojId"
            rules={[{ required: true, message: '백준 온라인 저지 아이디를 입력해주세요 !' }]}
          >
            <Input placeholder="BOJ ID" size="large" />
          </Form.Item>
          <TextLogin>이메일</TextLogin>
          <Form.Item
            name="email"
            rules={[{ required: true, message: '이메일을 입력해주세요 !' }]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>
          <Logintext><Link to="/login"><TextRegister>로그인</TextRegister></Link></Logintext>
          <br />
          <Form.Item>
            <Button type="primary" htmlType="submit" block size='large'>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  
  export default Register;