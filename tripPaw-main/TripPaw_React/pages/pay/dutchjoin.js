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
  const [participants, setParticipants] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState({});

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

  // 참가자 목록 불러오기
  useEffect(() => {
    if (!reservId) return;
    axios.get(`/pay/share/dutch/participants/${reservId}`)
      .then(res => {
        // 응답 데이터가 배열인지 확인하고, 아니면 빈 배열로 초기화
        const data = Array.isArray(res.data.participants) ? res.data.participants : [];
        setParticipants(data);
      })
      .catch(err => console.error('참가자 목록 불러오기 실패:', err));
  }, [reservId, success]);

  // 예약 정보가 로딩된 후에 결제 금액 계산
  const totalAmount = reserv ? reserv.totalAmount : 0; // 전체 금액
  const numParticipants = participants.length; // 참가자 수
  const amountPerPerson = numParticipants > 0 ? totalAmount / numParticipants : 0; // 1인당 결제 금액

  // 참가 버튼 클릭 시 → 참가자로 등록 요청
  const handleJoin = () => {
    const token = localStorage.getItem('accessToken'); // JWT 꺼내기

    axios.post(`/pay/share/dutch/join/${reservId}`, null, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}` // 또는 쿠키 등에서 읽은 토큰
      }
    })
      .then(() => {
        setSuccess(true);
        setParticipants(prev => [...prev, member]); // 참가자 목록에 추가
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
          <p>📍 장소: {reserv.place?.name}</p>
          <p>📅 기간: {reserv.startDate} ~ {reserv.endDate}</p>
          <p>💸 총금액: {totalAmount}원</p>
          <p>🎉 참가자 수: {numParticipants}명</p>
          <p>1인당 결제 금액: {amountPerPerson}원</p>
        </>
      )}

      {success ? (
        <p>✅ 성공적으로 참가했습니다!</p>
      ) : alreadyJoined ? (
        <p>⚠️ 이미 참가하셨습니다.</p>
      ) : (
        <Button onClick={handleJoin}>✋ 참가하기</Button>
      )}

      <h3>참가자 목록</h3>
      <ul>
        {/* 참가자가 배열일 때만 map() 호출 */}
        {Array.isArray(participants) && participants.length > 0 ? (
          participants.map((participant) => (
            <li key={participant.id}>
              {participant.username}
              {participant.id === member?.id && !paymentStatus[participant.id] && (
                <Button onClick={() => handlePayment(participant.id)}>
                  💳 결제하기
                </Button>
              )}
              {paymentStatus[participant.id] && <span>✅ 결제 완료</span>}
            </li>
          ))
        ) : (
          <p>참가자가 없습니다.</p>
        )}
      </ul>
    </Container>
  );
};

export default DutchPayJoinPage;
