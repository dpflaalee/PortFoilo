import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from 'styled-components';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ChatMenu from '../../../components/chat/ChatMenu';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;
const ChatContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 800px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;
const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  background-color: #f7f7f7;
  h2 { margin: 0; font-size: 1.2em; }
`;
const MenuIcon = styled.span`
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
    padding: 5px;
    color: #555;
    &:hover {
        color: #000;
    }
`;
const MessageArea = styled.ul`
  flex-grow: 1;
  list-style-type: none;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const MessageItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  &.event-message {
    justify-content: center;
    color: #888;
    font-size: 0.9em;
    margin: 5px 0;
  }
  &.my-message {
    flex-direction: row-reverse;
  }
`;
const Avatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => props.color};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
`;
const MessageContent = styled.div`
    display: flex;
    flex-direction: column;
    .sender { font-weight: bold; margin-bottom: 5px; }
    .text {
        background: #f1f0f0;
        padding: 10px 15px;
        border-radius: 18px;
        max-width: 400px;
        word-wrap: break-word;
    }
    &.my-message .text {
        background: #0084ff;
        color: white;
    }
    &.my-message {
      align-items: flex-end;
    }
`;
const ChatForm = styled.form`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  gap: 10px;
`;
const Input = styled.input`
    flex-grow: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
`;
const Button = styled.button`
    padding: 12px 20px;
    border: none;
    background-color: #0084ff;
    color: white;
    border-radius: 8px;
    cursor: pointer;
`;

const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];
const getAvatarColor = (sender) => {
  let hash = 0;
  for (let i = 0; i < sender.length; i++) {
    hash = 31 * hash + sender.charCodeAt(i);
  }
  return colors[Math.abs(hash % colors.length)];
};

function ChatRoom() {
  const router = useRouter();
  const { id: roomId } = router.query;

  const [roomTitle, setRoomTitle] = useState('');
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 위한 state
  const [selectedReservId, setSelectedReservId] = useState(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const stompClientRef = useRef(null);
  const messageAreaRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/auth/check', {
          withCredentials: true,
        });

        if (response.status === 200) {
          setIsLoggedIn(true);
          setUsername(response.data.username);
          return true; // 성공 시 true 반환
        }
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        router.push('/member/login');
        return false; // 실패 시 false 반환
      }
    };

    const fetchRoomInfo = async () => {
      try {
        const response = await axios.get(`/chat/room/${roomId}`);
        setRoomTitle(response.data.title);
      } catch (error) {
        console.error("채팅방 정보 로딩 실패:", error);
        alert("채팅방 정보를 불러올 수 없습니다. 채팅 목록으로 이동합니다.");
        router.push('/chat/chatRooms');
      }
    };

    const fetchInitialData = async () => {
      const isLoggedIn = await checkLoginStatus();
      if (isLoggedIn) {
        fetchRoomInfo();
      }
    };

    fetchInitialData();

    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.deactivate();
      }
    };
  }, [roomId, router]);

  useEffect(() => {
    if (!username || !roomTitle || stompClientRef.current?.connected) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      onConnect: () => {
        client.subscribe(`/topic/chat/${roomId}`, (payload) => {
          const message = JSON.parse(payload.body);
          setMessages(prev => [...prev, message]);
        });
        client.publish({
          destination: `/app/chat/${roomId}/addUser`,
          body: JSON.stringify({ sender: username, type: 'JOIN', roomId }),
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();
    stompClientRef.current = client;

  }, [username, roomTitle, roomId]);

  // 메시지 목록 변경 시 스크롤
  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    const messageContent = newMessage.trim();

    if (messageContent && stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: `/app/chat/${roomId}/sendMessage`,
        body: JSON.stringify({ sender: username, content: messageContent, type: 'CHAT', roomId }),
      });
      setNewMessage('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleExitChat = () => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: `/app/chat/${roomId}/addUser`,
        body: JSON.stringify({ sender: username, type: 'LEAVE', roomId }),
      });
      stompClientRef.current.deactivate();
    }
    router.push('/chat/chatRooms');
  };

  if (!roomId || !roomTitle || !username) {
    return <PageContainer><div>로딩 중...</div></PageContainer>;
  }

  // 더치페이
  const handleCreateDutchPay = () => {
    router.push({
      pathname: '/reserv/reservdutch',
      query: { roomId },
    });
  };

  return (
    <PageContainer>
      <ChatContainer>
        <ChatHeader>
          <h2>{roomTitle}</h2>
          <MenuIcon onClick={toggleMenu}>≡</MenuIcon>
        </ChatHeader>
        <MessageArea ref={messageAreaRef}>
          {messages.map((msg, index) => (
            <MessageItem
              key={index}
              className={msg.type !== 'CHAT' ? 'event-message' : (msg.sender === username ? 'my-message' : '')}
            >
              {msg.type === 'CHAT' ? (
                <>
                  <Avatar color={getAvatarColor(msg.sender)}>
                    {msg.sender[0]}
                  </Avatar>
                  <MessageContent className={msg.sender === username ? 'my-message' : ''}>
                    <span className="sender">{msg.sender}</span>
                    <div className="text" dangerouslySetInnerHTML={{ __html: msg.content }} />
                  </MessageContent>
                </>
              ) : (
                <span>{`${msg.sender}님이 ${msg.type === 'JOIN' ? '입장' : '퇴장'}했습니다.`}</span>
              )}
            </MessageItem>
          ))}
        </MessageArea>
        <ChatForm onSubmit={handleSendMessage}>
          <Input
            type="text"
            placeholder="메시지를 입력하세요"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit">전송</Button>
        </ChatForm>
        <ChatMenu
          isOpen={isMenuOpen}
          onClose={toggleMenu}
          onExit={handleExitChat}
          onCreateDutchPay={handleCreateDutchPay}
          selectedReservId={selectedReservId}
          setSelectedReservId={setSelectedReservId}
          selectedMemberIds={selectedMemberIds}
          setSelectedMemberIds={setSelectedMemberIds}
        />
      </ChatContainer>
    </PageContainer>
  );
}

export default ChatRoom;
