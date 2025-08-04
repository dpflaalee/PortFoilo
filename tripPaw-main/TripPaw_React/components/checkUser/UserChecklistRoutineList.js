// /루틴 목록 조회 및 루틴 선택
import { Collapse, message } from 'antd';
import { useEffect, useState } from 'react';
import { getRoutinesByMemberId } from '@/api/checkRoutine';
import UserChecklistItemList from './UserChecklistItemList';
import RoutineActionButtons from './RoutineActionButtons';
import { useRouter } from 'next/router';

const UserChecklistRoutineList = ({ memberId }) => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const shouldHideCheckbox = router.pathname.includes('/mypage/checklist/mychecklist');

  const fetchRoutines = async () => {
    setLoading(true);
    try {
      const data = await getRoutinesByMemberId(memberId);
      setRoutines(data);
    } catch (err) { message.error('루틴 목록 불러오기 실패');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (memberId) fetchRoutines();
  }, [memberId]);

  return (
    <div style={{padding:'10px'}}>
      <h3 style={{ marginBottom: 16, fontSize:'24px', fontWeight:'bold', color:'#653131', borderBottom:'2px solid #653131', paddingBottom:'12px', marginBottom:'36px' }}>내 체크리스트</h3>

      {/* 루틴 없을 때 메시지 추가 */}
      {routines.length === 0 && !loading && (
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '16px', color: '#999' }}>
          저장한 체크리스트 루틴이 존재하지 않습니다.
        </div>
      )}

      {/* 루틴 목록 */}
      <Collapse accordion style={{ background: 'transparent', border: 'none', padding:'0 16px' }}>
        {routines.map((routine) => (
          <Collapse.Panel style={{border:'none'}} key={routine.id}
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight:'bold', fontSize:'16px' }}>
                <span>{routine.title}</span>
                <RoutineActionButtons routine={routine} onRefresh={fetchRoutines} />
              </div>
            }
          >
            <UserChecklistItemList routineId={routine.id} hideCheckbox={shouldHideCheckbox}/>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default UserChecklistRoutineList;
