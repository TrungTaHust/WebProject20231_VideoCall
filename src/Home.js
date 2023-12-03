import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import conf from "../src/assets/conf.jpg";
import Navbar from "./components/Navbar";

import styled from 'styled-components';

const HeroContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: black;
  opacity: 0.6;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
`;

const Title = styled.h1`
  font-size: 5xl;
  @media (min-width: 768px) {
    font-size: 7xl;
  }
  font-weight: bold;
  padding-top: 12px;
  color: white;
`;

const Subtitle = styled.p`
  font-size: lg;
  @media (min-width: 768px) {
    font-size: xl;
  }
  margin-top: -2px;
`;

const FormContainer = styled.form`
  margin-top: 6rem;
  text-align: center;
`;

const RoomCodeLabel = styled.label`
  font-size: 2xl;
  @media (min-width: 768px) {
    font-size: 3xl;
  }
  font-weight: bold;
`;

const RoomCodeInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  max-width: 14rem;
  margin-top: 0.5rem;
  color: black;
  outline: none;
`;

const GoButton = styled.button`
  background-color: #3498db;
  &:hover {
    background-color: #2980b9;
  }
  color: white;
  font-weight: bold;
  border-radius: 9999px;
  padding: 0.5rem 1.5rem;
  margin-top: 1rem;
`;

const Home = () => {
  const [RoomCode, setRoomCode] = useState("");
  const history = useHistory();

  const submitCode = (e) => {
    e.preventDefault();
    history.push(`/room/${RoomCode}`);
  };
  const goBack = () => {
    history.push('/'); // Chuyển hướng
  };

  return (
    <div className="relative h-screen">
      {/* Navbar */}
      <Navbar />
      {/* Hero */}
      <HeroContainer>
        <HeroImage src={conf} alt="Hội nghị" />
        <Overlay />
        <HeroContent>
          <Title>Tạo/Tham gia phòng họp</Title>
          <Subtitle>Nhập thông tin dưới đây</Subtitle>
          <FormContainer onSubmit={submitCode}>
            <RoomCodeLabel>Nhập mã phòng</RoomCodeLabel>
            <RoomCodeInput
              type="text"
              required
              placeholder="Nhập mã phòng"
              value={RoomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <GoButton type="submit">Đi</GoButton>
            <GoButton onClick={goBack}>Quay lại</GoButton>
          </FormContainer>
        </HeroContent>
      </HeroContainer>
    </div>
  );
};
export default Home;
