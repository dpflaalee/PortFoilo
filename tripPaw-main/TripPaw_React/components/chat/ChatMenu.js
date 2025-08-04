import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

const MenuOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease-in-out;
  z-index: 10;
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 280px; /* 메뉴 너비 */
  height: 100%;
  background: #fff;
  border-left: 1px solid #ddd;
  box-shadow: -2px 0 8px rgba(0,0,0,0.1);
  transform: translateX(${props => (props.isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  z-index: 20;
  display: flex;
  flex-direction: column;
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0;
    font-size: 1.1em;
  }
  
  button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #888;
    padding: 0 5px;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

const MenuItem = styled.li`
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const ChatMenu = ({ isOpen, onClose, onExit, onCreateDutchPay }) => {

  return (
    <>
      <MenuOverlay isOpen={isOpen} onClick={onClose} />
      <MenuContainer isOpen={isOpen}>
        <MenuHeader>
          <h3>채팅 메뉴</h3>
          <button onClick={onClose}>&times;</button>
        </MenuHeader>
        <MenuList>
          <MenuItem>채팅방 정보</MenuItem>
          <MenuItem>참여 인원</MenuItem>
          <MenuItem>알림 설정</MenuItem>
          <MenuItem onClick={onCreateDutchPay}>더치페이 예약</MenuItem>        
          <MenuItem onClick={onExit} style={{ color: 'red' }}>채팅방 나가기</MenuItem>
        </MenuList>
      </MenuContainer>
    </>
  );
};

export default ChatMenu;