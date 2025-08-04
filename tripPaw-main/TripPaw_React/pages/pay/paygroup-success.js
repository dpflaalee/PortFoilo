import axios from 'axios';
import { CheckCircleFilled } from '@ant-design/icons';
import Link from 'next/link';
import CheckRoutineModal from '@/components/checklist/CheckRoutineModal';
import { useState } from 'react';

export async function getServerSideProps(context) {
  const { memberTripPlanId } = context.query;

  try {
    const res = await axios.get(`/reserv/membertripplan/${memberTripPlanId}`);
    const reservList = res.data;
    return { props: { reservList } };
  } catch (error) {
    return { props: { reservList: [] } };
  }
}

export default function SuccessBatchPage({ reservList }) {
  const memberTripPlanId = reservList[0]?.memberTripPlan?.id;
  const memberId = reservList[0]?.member?.id;
  const [modalOpen, setModalOpen] = useState(false);

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

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2.4em 0.8em' }}>
        <div style={{ display: 'table', width: '52%' }}>
          <p style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'left', fontWeight: 'bold' }}>트립포우의 체크리스트 기능을 이용해서 여행을 체계적으로 준비해보세요!</p>
        </div>
        <div>
          <button style={{ border: 'none', fontWeight: 'bold', padding: '1em', borderRadius: '5px' }}
            onClick={() => setModalOpen(true)}>여행 준비하기</button>
        </div>
        <CheckRoutineModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          memberTripPlanId={memberTripPlanId}
          memberId={memberId}
        />
      </div>

      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ flexGrow: 1, border: '1px solid #000', padding: '1em', borderRadius: '5px' }}>
          <Link href="/" style={{ color: '#000', fontWeight: 'bold', fontSize: '16px' }}>메인으로</Link>
        </div>
        <div style={{ flexGrow: 1, border: '1px solid #000', padding: '1em', backgroundColor: '#000', borderRadius: '5px' }}>
          <Link href="/mypage/reserv/reservlist" style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>예약 내역</Link>
        </div>
      </div>

    </div>
  );
}

