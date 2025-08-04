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
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #222;
  text-align: center;
  margin-bottom: 24px;
`;

const PayList = styled.ul`
  padding-left: 0;
  list-style: none;
  margin-bottom: 20px;
`;

const PayItem = styled.li`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 12px;
  background-color: #f9f9f9;
`;

const PayInfo = styled.p`
  margin: 4px 0;
  font-size: 15px;
  & > strong {
    color: #444;
  }
`;

const TotalAmount = styled.p`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin: 24px 0 16px;
`;

const PgSelectContainer = styled.div`
  margin: 16px 0 24px;
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
  padding: 14px;
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

function PayBatchPage() {
  const router = useRouter();
  const { memberTripPlanId } = router.query;

  const [totalAmount, setTotalAmount] = useState(0);
  const [payList, setPayList] = useState([]);
  const [selectedPg, setSelectedPg] = useState('html5_inicis');

  useEffect(() => {
    if (!memberTripPlanId) return;
    axios.post(`/pay/batch/${memberTripPlanId}`, null, {
      withCredentials: true,
    }).then(res => {
      setTotalAmount(res.data.totalAmount);
      setPayList(res.data.payList);
    }).catch(() => {
      alert('일괄 결제 정보 불러오기 실패');
    });
  }, [memberTripPlanId]);

  const loadIamportScript = () => {
    return new Promise((resolve, reject) => {
      if (window.IMP) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const onClickPay = async () => {
    await loadIamportScript();
    const { IMP } = window;
    IMP.init('imp83864415');

    IMP.request_pay(
      {
        pg: selectedPg,
        pay_method: 'card',
        name: '트립플랜 일괄결제',
        amount: totalAmount,
        buyer_email: 'user@example.com',
        buyer_name: '홍길동',
        buyer_tel: '010-1234-5678',
      },
      async (rsp) => {
        if (rsp.success) {
          try {
            await axios.post(`/pay/batch/${memberTripPlanId}/verify`,
              { impUid: rsp.imp_uid },
              { withCredentials: true });

            alert('일괄 결제가 완료되었습니다!');
            router.push({
              pathname: '/pay/paygroup-success',
              query: { memberTripPlanId: memberTripPlanId }
            });
          } catch (err) {
            alert('검증 중 오류가 발생했습니다.');
          }
        } else {
          alert('결제 실패: ' + rsp.error_msg);
        }
      }
    );
  };

  return (
    <Container>
      <Title>일괄 결제</Title>

      <PayList>
        {payList.map((pay, idx) => (
          <PayItem key={idx}>
            <PayInfo><strong>숙소:</strong> {pay.reserv.place?.name || '이름 없음'}</PayInfo>
            <PayInfo><strong>기간:</strong> {pay.reserv.startDate} ~ {pay.reserv.endDate}</PayInfo>
            <PayInfo><strong>금액:</strong> {pay.amount.toLocaleString()}원</PayInfo>
          </PayItem>
        ))}
      </PayList>

      <TotalAmount>총 결제 금액: {totalAmount.toLocaleString()}원</TotalAmount>

      <PgSelectContainer>
        <RadioLabel>
          <input
            type="radio"
            name="pg"
            value="html5_inicis"
            checked={selectedPg === 'html5_inicis'}
            onChange={(e) => setSelectedPg(e.target.value)}
          />
          KG이니시스
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

      <PayButton onClick={onClickPay}>일괄 결제하기</PayButton>
    </Container>
  );
}

export default PayBatchPage;
