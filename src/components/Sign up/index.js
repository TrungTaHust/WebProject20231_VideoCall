import React from 'react';
import { Row, Col, Button, Typography, Input } from 'antd';
import firebase, { auth } from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/services';

const { Title } = Typography;
const { Password } = Input;

const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export default function SignUp() {
  const handleSignUp = async (provider) => {
    try {
      if (provider === 'email') {
        // Thực hiện đăng ký bằng email và mật khẩu ở đây
        const email = ''; // Lấy giá trị email từ trường nhập email
        const password = ''; // Lấy giá trị mật khẩu từ trường nhập mật khẩu
        const { user } = await auth.createUserWithEmailAndPassword(email, password);

        // Thêm thông tin người dùng vào cơ sở dữ liệu
        addDocument('users', {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          providerId: 'email', // Đặt providerId cho email
          keywords: generateKeywords(user.displayName?.toLowerCase()),
        });
      } else {
        // Đăng ký bằng Google hoặc Facebook
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
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
    }
  };

  return (
    <div>
      <Row justify='center' style={{ height: 800 }}>
        <Col span={8}>
          <Title style={{ textAlign: 'center' }} level={3}>
            Đăng ký tài khoản
          </Title>
          <Input style={{ width: '100%', marginBottom: 5 }} placeholder="Email" />
          <Password style={{ width: '100%', marginBottom: 5 }} placeholder="Mật khẩu" />
          <Button
            style={{ width: '100%', marginBottom: 5 }}
            onClick={() => handleSignUp('email')}
          >
            Đăng ký bằng Email
          </Button>
          <Button
            style={{ width: '100%', marginBottom: 5 }}
            onClick={() => handleSignUp(googleProvider)}
          >
            Đăng ký bằng Google
          </Button>
          <Button
            style={{ width: '100%' }}
            onClick={() => handleSignUp(fbProvider)}
          >
            Đăng ký bằng Facebook
          </Button>
        </Col>
      </Row>
    </div>
  );
}
