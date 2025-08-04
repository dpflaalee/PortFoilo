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
`;

const Title = styled.h2`
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const InfoRow = styled.p`
  font-size: 16px;
  margin: 12px 0;
  & > span {
    font-weight: bold;
    color: #444;
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
  margin-top: 24px;

  &:hover {
    background-color: #005bb5;
  }
`;

const Message = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  color: green;
`;

const Error = styled(Message)`
  color: red;
`;

const DutchPayPaymentPage = () => {
  const router = useRouter();
  const { reservId } = router.query;

  const [payShare, setPayShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultMsg, setResultMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!reservId) return;

    axios.get(`/payshare/my-share/${reservId}`, { withCredentials: true })
      .then(res => {
        setPayShare(res.data);
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg('결제 정보를 불러오는 데 실패했습니다.');
        setLoading(false);
      });
  }, [reservId]);

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

  const handlePayment = async () => {
    if (!payShare) return;
    try {
      await loadIamportScript();
      const { IMP } = window;
      IMP.init('imp83864415');

      IMP.request_pay({
        pg: 'html5_inicis',
        pay_method: 'card',
        name: '더치페이 결제',
        amount: payShare.amount,
        buyer_name: payShare.member.username,
        buyer_email: 'user@example.com',
        buyer_tel: '010-1234-5678',
      }, async (rsp) => {
        if (rsp.success) {
          try {
            await axios.post('/pay/share/complete', {
              impUid: rsp.imp_uid,
              payShareId: payShare.id
            }, { withCredentials: true });

            setResultMsg('결제가 완료되었습니다!');
          } catch {
            setErrorMsg('결제 검증에 실패했습니다.');
          }
        } else {
          alert('결제 실패: ' + rsp.error_msg);
        }
      });
    } catch (err) {
      setErrorMsg('결제 모듈을 불러오는 데 실패했습니다.');
    }
  };

  if (loading) return <Container><p>⏳ 결제 정보를 불러오는 중입니다...</p></Container>;
  if (!payShare) return <Container><Error>❌ 결제 정보 없음</Error></Container>;

  return (
    <Container>
      <Title>더치페이 결제</Title>
      <InfoRow><span>참여자:</span> {payShare.member.username}</InfoRow>
      <InfoRow><span>결제 금액:</span> {payShare.amount.toLocaleString()}원</InfoRow>
      <InfoRow><span>결제 상태:</span> {payShare.hasPaid ? '완료됨' : '미결제'}</InfoRow>

      {!payShare.hasPaid && (
        <PayButton onClick={handlePayment}>💳 결제하기</PayButton>
      )}

      {resultMsg && <Message>{resultMsg}</Message>}
      {errorMsg && <Error>{errorMsg}</Error>}
    </Container>
  );
};

export default DutchPayPaymentPage;
