import axios from 'axios';
import { CheckCircleFilled } from '@ant-design/icons';
import Link from 'next/link';

export async function getServerSideProps(context) {
  const { reservId } = context.query;

  try {
    const res = await axios.get(`/reserv/${reservId}`);
    const reserv = res.data;
    const place = reserv.place ?? null;

    const resPay = await axios.get(`/pay/reserv/${reservId}`);
    const pay = resPay.data;

    return { props: { reserv, place, pay } };
  } catch (error) {
    console.error(error);
    return { props: { reserv: null, place: null, pay: null } };
  }
}

export default function SuccessSinglePage({ reserv, place, pay }) {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', fontFamily: 'Arial' }}>
      <CheckCircleFilled style={{ fontSize: 48, color: '#4BB543' }} />
      <h1>결제 성공!</h1>
      <p>예약이 정상적으로 완료되었습니다.</p>

      <div style={{ marginTop: 30, textAlign: 'left', border: '1px solid #eee', padding: 15, borderRadius: 8 }}>
        <p><strong>예약 번호:</strong> {reserv?.id ?? '-'}</p>
        <p><strong>결제 금액:</strong> {pay?.amount}원</p>
        <p><strong>예약 기간:</strong> {reserv?.startDate} ~ {reserv?.endDate}</p>
        <p><strong>인원 수:</strong> {reserv?.countPeople}명</p>
        <p><strong>반려동물 수:</strong> {reserv?.countPet}마리</p>
      </div>

      <div style={{ marginTop: 30, textAlign: 'left', border: '1px solid #eee', padding: 15, borderRadius: 8 }}>
        <h2>{place?.name ?? '장소 정보 없음'}</h2>
        <p>{place?.region ?? '-'}</p>
      </div>

      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 20 }}>
        <Link href="/">메인으로</Link>
        <Link href="/mypage/reserv/reservlist">예약 내역</Link>
      </div>
    </div>
  );
}