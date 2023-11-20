// Login/index.js
import React, { useState } from 'react';
import { Row, Col, Button, Typography, Input } from 'antd';
import firebase, { auth } from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/services';
import SignUp from '../SignUp'; // Import trang đăng ký

const { Title } = Typography;

const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (provider) => {
    try {
      const { additionalUserInfo, user } = await auth.signInWithPopup(provider);

      if (additionalUserInfo?.isNewUser) {
        addDocument('users', {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          providerId: additionalUserInfo.providerId,
          keywords: generateKeywords(user.displayName?.toLowerCase()),
        });
      }

      console.log('Đăng nhập thành công:', user);
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.message);
    }
  };

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignInWithEmailAndPassword = async () => {
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      console.log('Đăng nhập thành công:', user);
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.message);
    }
  };

  return (
    <div>
      <Row justify='center' style={{ height: 800 }}>
        <Col span={8}>
          <Title style={{ textAlign: 'center' }} level={3}>
            {isSignUp ? 'Đăng Ký' : 'Đăng Nhập'}
          </Title>

          {!isSignUp && (
            <>
              {/* Đoạn mã cho đăng nhập bằng Google và Facebook */}
              <Button
                style={{ width: '100%', marginBottom: 5 }}
                onClick={() => handleLogin(googleProvider)}
              >
                Đăng nhập bằng Google
              </Button>
              <Button
                style={{ width: '100%' }}
                onClick={() => handleLogin(fbProvider)}
              >
                Đăng nhập bằng Facebook
              </Button>

              {/* Nút chuyển hướng sang trang đăng ký */}
              <Button style={{ width: '100%', marginTop: 10 }} onClick={handleToggleForm}>
                Đăng Ký mới
              </Button>
            </>
          )}

          {isSignUp && (
            // Sử dụng trang đăng ký
            <SignUp />
          )}

          {!isSignUp && (
            // Form đăng nhập với email và password
            <div style={{ marginTop: 20 }}>
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
              <Button style={{ width: '100%' }} onClick={handleSignInWithEmailAndPassword}>
                Đăng Nhập
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
