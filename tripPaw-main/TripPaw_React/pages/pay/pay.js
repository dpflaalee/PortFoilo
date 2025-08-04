import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 480px;
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgb(0 0 0 / 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
`;

const Title = styled.h2`
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 700;
  color: #222;
  text-align: center;
`;

const InfoRow = styled.p`
  font-size: 16px;
  margin: 8px 0;
  & > span {
    font-weight: 600;
    color: #555;
  }
`;

const PgSelectContainer = styled.div`
  margin: 32px 0 24px 0;
`;

const PgTitle = styled.h3`
  margin-bottom: 12px;
  font-weight: 600;
  color: #444;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  
  input[type='radio'] {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #ccc;
    border-radius: 50%;
    margin-right: 12px;
    position: relative;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }
  input[type='radio']:checked {
    border-color: #0070f3;
    background-color: #0070f3;
  }
  input[type='radio']:checked::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
  }
`;

const PayButton = styled.button`
  width: 100%;
  padding: 14px 0;
  background-color: #0070f3;
  color: white;
  font-size: 18px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.25s ease;
  
  &:hover {
    background-color: #005bb5;
  }
  &:active {
    background-color: #004494;
  }
`;

const HomeButton = styled(PayButton)`
  background-color: #666;
  margin-top: 16px;
  
  &:hover {
    background-color: #444;
  }
  &:active {
    background-color: #222;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 40px;
`;

const ErrorText = styled.p`
  text-align: center;
  font-size: 16px;
  color: #e63946;
  margin-top: 40px;
`;

function PaymentPage() {
  const router = useRouter();
  const {
    reservId,
    memberId,
    countPeople,
    countPet,
    startDate,
    endDate,
    amount,
  } = router.query;

  const [reservData, setReservData] = useState({
    reservId,
    memberId,
    countPeople,
    countPet,
    startDate,
    endDate,
    amount,
  });

  const [loading, setLoading] = useState(!reservId);
  const [error, setError] = useState(null);

  // PG사 선택 상태 (기본값: html5_inicis)
  const [selectedPg, setSelectedPg] = useState('html5_inicis');

  useEffect(() => {
    if (!reservId?.trim()) return;

    // 예약정보가 query에 없으면 API 호출
    if (!memberId || !countPeople || !countPet || !startDate || !endDate || !amount) {
      setLoading(true);
      axios.get(`/reserv/${reservId}`)
        .then(res => {
          const data = res.data;
          setReservData({
            reservId: data.id,
            memberId: data.member.id,
            countPeople: data.countPeople,
            countPet: data.countPet,
            startDate: data.startDate,
            endDate: data.endDate,
            amount: data.amount || 10000,
          });
          setLoading(false);
        })
        .catch(() => {
          setError('예약 정보를 불러오지 못했습니다.');
          setLoading(false);
        });
    }
  }, [reservId]);

  const loadIamportScript = () => {
    return new Promise((resolve, reject) => {
      if (window.IMP) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('iamport script load failed'));
      document.head.appendChild(script);
    });
  };

  const onClickPay = async () => {
    try {
      await loadIamportScript();
      const { IMP } = window;
      IMP.init('imp83864415'); // 가맹점 식별코드 변경

      IMP.request_pay(
        {
          pg: selectedPg,
          pay_method: 'card',
          name: '트립포우 예약 결제',
          amount: Number(reservData.amount),
          buyer_email: 'user@example.com',
          buyer_name: '홍길동',
          buyer_tel: '010-1234-5678',
        },
        async (rsp) => {
          if (rsp.success) {
            try {
              await axios.post('/pay/verify', null, {
                params: {
                  impUid: rsp.imp_uid,
                  merchantUid: rsp.merchant_uid,
                  reservId: reservData.reservId,
                  memberId: reservData.memberId,
                },
                withCredentials: true,
              });
              alert('결제가 완료되었습니다!');
              router.push({
                pathname: '/pay/pay-success',
                query: { reservId: reservData.reservId }
              });
            } catch {
              alert('결제 검증 중 오류가 발생했습니다.');
            }
          } else {
            alert('결제 실패: ' + rsp.error_msg);
          }
        }
      );
    } catch (error) {
      alert('결제 스크립트 로드에 실패했습니다.');
    }
  };

  if (loading) return <LoadingText>예약 정보를 불러오는 중입니다...</LoadingText>;
  if (error) return <ErrorText>{error}</ErrorText>;
  if (!reservData.reservId) return <ErrorText>예약 정보가 없습니다. 예약 페이지로 이동해 주세요.</ErrorText>;

  return (
    <Container>
      <Title>결제하기</Title>
      <InfoRow><span>예약 번호:</span> {reservData.reservId}</InfoRow>
      <InfoRow><span>인원 수:</span> {reservData.countPeople}명</InfoRow>
      <InfoRow><span>반려동물 수:</span> {reservData.countPet}마리</InfoRow>
      <InfoRow><span>예약 기간:</span> {reservData.startDate} ~ {reservData.endDate}</InfoRow>
      <InfoRow><span>결제 금액:</span> {reservData.amount.toLocaleString()}원</InfoRow>

      <PgSelectContainer>
        <PgTitle>PG사 선택</PgTitle>
        <RadioLabel>
          <input
            type="radio"
            name="pg"
            value="html5_inicis"
            checked={selectedPg === 'html5_inicis'}
            onChange={(e) => setSelectedPg(e.target.value)}
          />
          카드결제
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="pg"
            value="kakaopay.TC0ONETIME"
            checked={selectedPg === 'kakaopay.TC0ONETIME'}
            onChange={(e) => setSelectedPg(e.target.value)}
          />
          카카오페이
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="pg"
            value="tosspay.tosstest"
            checked={selectedPg === 'tosspay.tosstest'}
            onChange={(e) => setSelectedPg(e.target.value)}
          />
          토스페이
        </RadioLabel>
      </PgSelectContainer>

      <PayButton onClick={onClickPay}>결제하기</PayButton>
      <HomeButton onClick={() => router.push('/')}>홈으로 가기</HomeButton>
    </Container>
  );
}

export default PaymentPage;
