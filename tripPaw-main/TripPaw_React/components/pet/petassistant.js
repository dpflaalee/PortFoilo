import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import petImg from './petimg/petaiimg.png';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// 이미지 좌우 흔들림 + 약간 회전 애니메이션
const waggleRotate = keyframes`
  0%, 100% { transform: translateX(0) rotate(0deg); }
  50% { transform: translateX(6px) rotate(5deg); }
`;

const PetAssistantWrapper = styled.div`
  position: fixed;
  bottom: 50px;
  right: 40px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  animation: ${({ animate }) =>
    animate ? css`${fadeInUp} 0.6s ease forwards` : 'none'};
  gap: 15px;
`;

const SpeechBubble = styled.div`
  background: #2a2a2a; /* 다크 그레이 */
  border-radius: 18px 18px 18px 6px;
  padding: 14px 20px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.6);
  font-size: 1.1rem;
  width: 250px;
  max-width: 300px;
  line-height: 1.5;
  position: relative;
  margin-left: 24px;
  color: #ddd; /* 밝은 그레이 */
  font-weight: 600;
  font-family: 'Nunito', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  user-select: none;
  letter-spacing: 0.02em;

  &::after {
    content: '';
    position: absolute;
    bottom: -14px;
    left: 28px;
    width: 0;
    height: 0;
    border-top: 14px solid #2a2a2a;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
  }
`;

const PetImage = styled.img`
  width: 180px;
  height: auto;
  filter: drop-shadow(2px 3px 6px rgba(164, 90, 42, 0.3));
  user-select: none;
  animation: ${waggleRotate} 2s ease-in-out infinite;
  transition: transform 0.3s ease;

  &:hover {
    animation: none;
    transform: translateY(-5px) scale(1.08) rotate(3deg);
  }
`;

const messagesByState = {
  WAITING: '결제 잊지 말개!',
  CONFIRMED: '잘했개! 즐거운 시간 보내개~',
  CANCELLED: '가지 말개!! 🐾',
  EXPIRED: '지나버린 예약이개... 다음에 다시 도전! 💨',
  DEFAULT: '나랑 산책 갈개~ 준비됐개?'
};

const PetAssistant = ({ reservState }) => {
  const [message, setMessage] = useState(messagesByState.DEFAULT);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => {
      setMessage(messagesByState[reservState] || messagesByState.DEFAULT);
      setAnimate(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [reservState]);

  return (
    <PetAssistantWrapper animate={animate}>
      <SpeechBubble>{message}</SpeechBubble>
      <PetImage src={petImg.src} alt="AI 펫 캐릭터" />
    </PetAssistantWrapper>
  );
};

export default PetAssistant;
