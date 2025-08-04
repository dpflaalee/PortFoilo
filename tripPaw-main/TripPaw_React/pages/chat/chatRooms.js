import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components'; // 1. styled-components 
import Link from 'next/link';

const RoomListContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 25px;
`;

const SubHeading = styled.h3`
  margin-top: 30px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
`;

const CreateRoomForm = styled.form`
  display: flex;
  align-items: center;
  margin-top: 15px;
`;

const RoomUl = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 15px;

  li {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      background-color: #f9f9f9;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      cursor: pointer;
    }
  }

  a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    font-size: 1.2em;
  }
`;

function ChatRoomList() {
  const [rooms, setRooms] = useState([]);
  const [newRoomTitle, setNewRoomTitle] = useState('');

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/chat/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('채팅방 목록을 불러오는 데 실패했습니다:', error);
      alert('채팅방 목록을 불러올 수 없습니다.');
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    if (!newRoomTitle.trim()) {
      alert('채팅방 이름을 입력해주세요.');
      return;
    }
    try {
      await axios.post('/chat/rooms', { title: newRoomTitle });
      setNewRoomTitle('');
      fetchRooms();
    } catch (error) {
      console.error('채팅방 생성에 실패했습니다:', error);
      alert('채팅방 생성에 실패했습니다.');
    }
  };

  return (
    <RoomListContainer>
      <Title>채팅방 목록</Title>
      <div>
        <SubHeading>새 채팅방 만들기</SubHeading>
        <CreateRoomForm onSubmit={handleCreateRoom}>
          <div className="form-group" style={{ flexGrow: 1, marginRight: '10px' }}>
            <input
              type="text"
              id="roomName"
              placeholder="채팅방 이름을 입력하세요"
              className="form-control" // Bootstrap 클래스는 그대로 사용 가능
              value={newRoomTitle}
              onChange={(e) => setNewRoomTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">만들기</button>
          </div>
        </CreateRoomForm>
      </div>
      <hr />
      <SubHeading>참여 가능한 채팅방</SubHeading>
      <RoomUl>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <li key={room.id}>
              <Link href={`/chat/chatRoom/${room.id}`} passHref>
                {room.title}
              </Link>
            </li>
          ))
        ) : (
          <li>참여 가능한 채팅방이 없습니다.</li>
        )}
      </RoomUl>
    </RoomListContainer>
  );
}

export default ChatRoomList;
