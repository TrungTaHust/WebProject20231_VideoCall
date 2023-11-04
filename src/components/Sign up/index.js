import React from 'react';
import { Row, Col, Button, Typography, Form, Input } from 'antd';
import firebase, { auth } from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/services';

const { Title } = Typography;
const { Password } = Input;

const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export default function SignUp() {
  const handleSignUp = async (values, provider) => {
    try {
      if (provider === 'email') {
        const { email, password } = values;

        // Thực hiện đăng ký bằng email và mật khẩu
        const { user } = await auth.createUserWithEmailAndPassword(email, password);

        // Thêm thông tin người dùng vào cơ sở dữ liệu
        addDocument('users', {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          providerId: 'email',
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
      <Row justify='center' style={{ height: '100vh' }}>
        <Col span={8}>
          <Title style={{ textAlign: 'center' }} level={3}>
            Đăng ký tài khoản
          </Title>
          <Form
            name="signup"
            initialValues={{ remember: true }}
            onFinish={(values) => handleSignUp(values, 'email')}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Password placeholder="Mật khẩu" />
            </Form.Item>
            <Form.Item>
              <Button className="signup-button" type="primary" htmlType="submit">
                Đăng ký bằng Email
              </Button>
            </Form.Item>
          </Form>
          <Button className="signup-button" onClick={() => handleSignUp(null, googleProvider)}>
            Đăng ký bằng Google
          </Button>
          <Button className="signup-button" onClick={() => handleSignUp(null, fbProvider)}>
            Đăng ký bằng Facebook
          </Button>
        </Col>
      </Row>
    </div>
  );
}
