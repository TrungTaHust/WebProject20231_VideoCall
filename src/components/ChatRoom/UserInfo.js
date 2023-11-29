import React from 'react';
import { Button, Avatar, Typography } from 'antd';
import styled from 'styled-components';

import { auth } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';



const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: 20px;
  border-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
  }
  button:nth-child(2) {
    height: 40px; /* Điều chỉnh chiều cao của nút */
    margin-right: 10px;
    font-size: 16px; /* Điều chỉnh kích thước chữ trong nút */
  }
`;


export default function UserInfo() {
  const {
    user: { displayName, photoURL },
  } = React.useContext(AuthContext);
  const { clearState } = React.useContext(AppContext);
  


  return (
    <WrapperStyled>
      <div>
        <Avatar src={photoURL}>
          {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className='username'>{displayName}</Typography.Text>
      </div>
      <Button
        ghost
        onClick={() => {
          // clear state in App Provider when logout
          clearState();
          auth.signOut();
        }}
      >
        Đăng xuất
      </Button>
    </WrapperStyled>
  );
}
