import axios from 'axios';
import { CheckCircleFilled } from '@ant-design/icons';
import Link from 'next/link';

export async function getServerSideProps(context) {
  const { tripPlanId } = context.query;

  try {
    const res = await axios.get(`/reserv/tripplan/${tripPlanId}`);
    const reservList = res.data;

    return { props: { reservList } };
  } catch (error) {
    console.error(error);
    return { props: { reservList: [] } };
  }
}

export default function SuccessBatchPage({ reservList }) {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', fontFamily: 'Arial' }}>
      <CheckCircleFilled style={{ fontSize: 48, color: '#4BB543' }} />
      <h1>일괄 결제 성공!</h1>
      <p>총 {reservList.length}건의 예약이 완료되었습니다.</p>

      <div style={{ marginTop: 20, textAlign: 'left', border: '1px solid #eee', padding: 15, borderRadius: 8, maxHeight: 400, overflowY: 'auto' }}>
        {reservList.map((r) => (
          <div key={r.id} style={{ marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
            <p><strong>예약 번호:</strong> {r.id}</p>
            <p><strong>결제 금액:</strong> {r.final_price ?? '10000'}원</p>
            <p><strong>예약 기간:</strong> {r.startDate} ~ {r.endDate}</p>
            <p><strong>인원 수:</strong> {r.countPeople}명</p>
            <p><strong>반려동물 수:</strong> {r.countPet}마리</p>
            <p><strong>장소 이름:</strong> {r.place?.name ?? '-'}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 20 }}>
        <Link href="/">메인으로</Link>
        <Link href="/mypage/reserv/reservlist">예약 내역</Link>
      </div>
    </div>
  );
}

