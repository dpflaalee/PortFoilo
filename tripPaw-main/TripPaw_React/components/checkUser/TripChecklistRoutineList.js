import { Button, Collapse, message } from 'antd';
import { useEffect, useState } from 'react';
import { getRoutinesByTripPlan } from '@/api/checkRoutine'; 
import UserChecklistItemList from './UserChecklistItemList'; 
import CheckRoutineModal from '../checklist/CheckRoutineModal';

const TripChecklistRoutineList = ({ memberId, memberTripPlanId }) => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRoutines = async () => {
    setLoading(true);
    try {
      const data = await getRoutinesByTripPlan(memberId, memberTripPlanId); // 여행용 루틴 불러오기
      setRoutines(data);
    } catch (err) { message.error('여행 체크리스트를 불러오지 못했습니다.');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (memberId && memberTripPlanId) fetchRoutines(); }, [memberId, memberTripPlanId]);

  return (
    <div style={{ padding: '10px' }}>
      <h3 style={{  marginBottom: 16,  fontSize: '24px', fontWeight: 'bold', color: '#146E37',  borderBottom: '2px solid #146E37', paddingBottom: '12px', marginBottom: '36px' }}> 여행 체크리스트 </h3>

      {/* 루틴 없을 때 안내 메시지와 버튼 */}
      {routines.length === 0 && !loading && (
        <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '40px' }}>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>
            체크리스트를 만들어 여행준비를 편리하게 하세요!
          </p>
          <Button type="primary"
            onClick={() => {setModalOpen(true); }}
          >
          <CheckRoutineModal open={modalOpen} onClose={()=>setModalOpen(false)} memberTripPlanId={memberTripPlanId} memberId={memberId} />
            체크리스트 만들기
          </Button>
        </div>
      )}

      <Collapse accordion style={{ background: 'transparent', border: 'none', padding: '0 16px' }}>
        {routines.map((routine) => (
          <Collapse.Panel style={{ border: 'none' }} key={routine.id}
            header={
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                <span>{routine.title}</span>
              </div>
            }
          >
            <UserChecklistItemList routineId={routine.id} hideCheckbox={false} />
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default TripChecklistRoutineList;
