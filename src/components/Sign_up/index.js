// SignUp/index.js
import React, { useState } from 'react';
import { Row, Col, Button, Typography, Input } from 'antd';
import firebase, { auth } from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/services';

const { Title } = Typography;

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);

      // Nếu muốn thêm thông tin người dùng vào Firestore khi đăng ký mới
      addDocument('users', {
        email: user.email,
        uid: user.uid,
        // Các thông tin khác có thể thêm vào đây
        keywords: generateKeywords(user.email?.toLowerCase()),
      });

      console.log('Đăng ký thành công:', user);
    } catch (error) {
      console.error('Lỗi đăng ký:', error.message);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <Row justify='center' style={{ height: 800 }}>
        <Col span={8}>
          <Title style={{ textAlign: 'center' }} level={3}>
            Đăng Ký
          </Title>
          {/* Các trường đầu vào cho email và password */}
          <Input
            placeholder="Email"
            style={{ marginBottom: 10 }}
            value={email}
            onChange={handleEmailChange}
          />
          <Input.Password
            placeholder="Password"
            style={{ marginBottom: 10 }}
            value={password}
            onChange={handlePasswordChange}
          />
          <Button style={{ width: '100%', marginBottom: 5 }} onClick={handleSignUp}>
            Đăng Ký
          </Button>
        </Col>
      </Row>
    </div>
  );
}
