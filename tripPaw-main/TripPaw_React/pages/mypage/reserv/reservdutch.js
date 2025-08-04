import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, addDays, eachDayOfInterval, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import ContentHeader from '../../components/ContentHeader';
import PetAssistant from '../../components/pet/petassistant';
import styled from 'styled-components';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import MypageLayout from '@/components/layout/MyPageLayout';

const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  font-family: 'Segoe UI', sans-serif;
  background: #fdfdfd;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 40px;
  color: #222;
`;

const Layout = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
`;

const ImageSection = styled.div`
  flex: 1;
  min-width: 300px;

  img {
    width: 100%;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  }

  p {
    color: #555;
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const Form = styled.form`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  width: 100px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const ExpireText = styled.p`
  font-size: 0.95rem;
  color: #666;
`;

const SubmitButton = styled.button`
  background-color: #2c7be5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s;

  &:hover {
    background-color: #1a5edb;
  }
`;

const ErrorMsg = styled.p`
  color: red;
  font-weight: bold;
`;

function reservdutch() {
  const router = useRouter();
  const { roomId } = router.query;
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [countPeople, setCountPeople] = useState(1);
  const [countPet, setCountPet] = useState(0);
  const [memberId, setMemberId] = useState(1);
  const [placeId, setPlaceId] = useState(1);
  const [tripPlanId, setTripPlanId] = useState(null);
  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null);
  const [username, setUsername] = useState('');
  const [showJoinPrompt, setShowJoinPrompt] = useState(false);
  const [createdReservId, setCreatedReservId] = useState(null);

  const handleJoinClick = () => {
    if (createdReservId) {
      router.push(`/pay/dutch?reservId=${createdReservId}`);
    }
  };

  const place = {
    name: "강원도 평창 오대산 국립공원",
    description: "아름다운 자연 경관과 등산로가 유명한 강원도 평창의 대표적인 산림 공원입니다.",
    imageUrl: "https://cdn.pixabay.com/photo/2015/10/12/15/45/mountains-984431_1280.jpg"
  };

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
    });
    stompClient.activate();
    setClient(stompClient);
    const response = axios.get('/api/auth/check', { withCredentials: true })
      .then(response => {
        const username = response.data.username;
        setUsername(username);
      })
      .catch(error => {
      });

    return () => {
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    axios.get('/reserv/disabled-dates')
      .then(res => {
        const allDisabled = [];
        const today = new Date();

        res.data.forEach(({ startDate, endDate }) => {
          if (parseISO(endDate) >= today) {
            const range = eachDayOfInterval({
              start: parseISO(startDate),
              end: parseISO(endDate)
            });
            allDisabled.push(...range);
          }
        });
        setDisabledDates(allDisabled);
      })
      .catch(err => {
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomId) {
      alert("채팅방 정보가 없습니다.");
      return;
    }

    // 예약 데이터 준비
    const expireAtDate = addDays(new Date(), 5);
    const payload = {
      startDate: format(dateRange[0].startDate, 'yyyy-MM-dd'),
      endDate: format(dateRange[0].endDate, 'yyyy-MM-dd'),
      expireAt: format(expireAtDate, 'yyyy-MM-dd'),
      countPeople: Number(countPeople),
      countPet: Number(countPet),
      member: { id: memberId },
      place: { id: placeId },
      tripPlan: tripPlanId ? { id: tripPlanId } : null,
    };

    try {
      // 예약 생성
      const res = await axios.post('/reserv', payload);
      alert('예약 성공! 🎉');

      const reservId = res.data.id;
      setCreatedReservId(reservId);
      setShowJoinPrompt(true);

      // 채팅방에 더치페이 참가 메시지 발송
      if (client && client.connected) {
        const message = {
          type: 'CHAT',
          sender: username || 'anonymous',
          roomId: roomId,
          content: `
            더치페이 예약을 생성했습니다.<br/>
            <a href="/pay/dutchjoin?reservId=${reservId}" style="display:inline-block;margin-top:8px;padding:6px 14px;background:#2c7be5;color:white;border-radius:6px;text-decoration:none;">
              참가하기
            </a>
          `,
        };

        client.publish({
          destination: `/app/chat/${roomId}/sendMessage`,
          body: JSON.stringify(message),
        });
      }
      // 채팅방으로 돌아가기
      router.push(`/chat/chatRoom/${roomId}`);

    } catch (err) {
      const errorData = err.response?.data;
      const messageText = typeof errorData === 'string'
        ? errorData
        : errorData?.message || '예약 생성 실패';

      setMessage(messageText);
    }
  };

  return (
    <>
      <MypageLayout>
        <Container>
          <Title>{place.name}</Title>

          <Layout>
            <ImageSection>
              <img src={place.imageUrl} alt={place.name} />
              <p>{place.description}</p>
            </ImageSection>

            <Form onSubmit={handleSubmit}>
              <div>
                <Label>예약 날짜</Label>
                <DateRange
                  editableDateInputs={true}
                  onChange={item => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  minDate={new Date()}
                  disabledDates={disabledDates}
                />
              </div>

              <ExpireText>⏳ 만료일: <strong>{format(addDays(new Date(), 5), 'yyyy-MM-dd')}</strong> (자동 설정)</ExpireText>

              <div>
                <Label>인원 수</Label>
                <Input
                  type="number"
                  min="1"
                  value={countPeople}
                  onChange={(e) => setCountPeople(e.target.value)}
                />
              </div>

              <div>
                <Label>반려동물 수</Label>
                <Input
                  type="number"
                  min="0"
                  value={countPet}
                  onChange={(e) => setCountPet(e.target.value)}
                />
              </div>

              <SubmitButton type="submit">📝 예약 생성하기</SubmitButton>

              {message && <ErrorMsg>{message}</ErrorMsg>}
            </Form>
          </Layout>
          <PetAssistant />
        </Container>
      </MypageLayout>
    </>
  );
}

export default reservdutch;
