import React from 'react';
import { Collapse, Typography, Button } from 'antd';
import styled from 'styled-components';
import { PlusSquareOutlined } from '@ant-design/icons';
import { AppContext } from '../../Context/AppProvider';
import { VideoCameraOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
      font-size: 20px;
    }

    .ant-collapse-content-box {
      padding: 0 40px;
      background-color: black;
    }

    .add-room {
      color: white;
      padding: 0;
    }
  }
`;
const CreateRoomButton = styled(Button)`
  display: block;
  margin: 0 auto;
  font-size: 20px;
  padding: 5px 10px;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: black;
  font-size: 20px;
`;

export default function RoomList() {
  const { rooms, setIsAddRoomVisible, setSelectedRoomId } =
    React.useContext(AppContext);

  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };
  const history = useHistory();
  const goToLobby = () => {
    history.push('/home'); // Chuyển hướng đến '/lobby'
  };
  return (
    <Collapse ghost defaultActiveKey={['1']}>
      <CreateRoomButton
        icon = {<VideoCameraOutlined />}
        onClick={goToLobby}
      >
        Tạo phòng họp
      </CreateRoomButton>
      <PanelStyled header='Danh sách các phòng' key='1'>
        {rooms.map((room) => (
          <LinkStyled key={room.id} onClick={() => setSelectedRoomId(room.id)}>
            {room.name}
          </LinkStyled>
        ))}
        <Button
          type='text'
          icon={<PlusSquareOutlined />}
          className='add-room'
          onClick={handleAddRoom}
        >
          Thêm phòng
        </Button>
      </PanelStyled>
    </Collapse>
  );
}
