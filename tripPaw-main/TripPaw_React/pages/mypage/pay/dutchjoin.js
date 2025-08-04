import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  text-align: center;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #2c7be5;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #1a5edb;
  }
`;

const DutchPayJoinPage = () => {
  const router = useRouter();
  const { reservId } = router.query;

  const [reserv, setReserv] = useState(null);
  const [member, setMember] = useState(null);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [success, setSuccess] = useState(false);

  // 로그인 유저 정보 가져오기
  useEffect(() => {
    axios.get('/api/auth/check', { withCredentials: true })
      .then(res => setMember(res.data))
      .catch(() => alert('로그인이 필요합니다.'));
  }, []);

  // 예약 정보 불러오기
  useEffect(() => {
    if (!reservId) return;
    axios.get(`/reserv/${reservId}`)
      .then(res => setReserv(res.data));
  }, [reservId]);

  // 참여 버튼 클릭 시 → 참가자로 등록 요청
  const handleJoin = () => {
    const token = localStorage.getItem('accessToken'); //JWT 꺼내기

    axios.post(`/payshare/dutch/join/${reservId}`, null, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}` // 또는 쿠키 등에서 읽은 토큰
      }
    })
      .then(() => {
        setSuccess(true);
        router.push(`/mypage/pay/payshare?reservId=${reservId}`);
      })
      .catch(err => {
        if (err.response?.status === 409) {
          setAlreadyJoined(true);
        } else {
          alert('참가 실패: ' + err.response?.data?.message);
        }
      });
  };

  return (
    <Container>
      <h1>더치페이 참가</h1>

      {reserv && (
        <>
          <p>📍 장소: {reserv.place.name}</p>
          <p>📅 기간: {reserv.startDate} ~ {reserv.endDate}</p>
        </>
      )}

      {success ? (
        <p>✅ 성공적으로 참가했습니다!</p>
      ) : alreadyJoined ? (
        <p>⚠️ 이미 참가하셨습니다.</p>
      ) : (
        <Button onClick={handleJoin}>✋ 참가하기</Button>
      )}
    </Container>
  );
};

export default DutchPayJoinPage;
