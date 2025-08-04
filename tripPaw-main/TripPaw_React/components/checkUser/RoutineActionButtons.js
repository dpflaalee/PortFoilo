import { Button, message, Space } from 'antd';
import { deleteRoutine, updateRoutine } from '@/api/checkRoutine';
import { useState } from 'react';
import RoutineEditorModal from './RoutineEditorModal';

const RoutineActionButtons = ({ routine, onRefresh }) => {
  const [visible, setVisible] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteRoutine(routine.id);
      message.success('루틴이 삭제되었습니다.');
      onRefresh();
    } catch (err) {message.error('루틴 삭제 실패');}
  };

  return (
    <Space>
      <Button onClick={() => setVisible(true)}
       style={{border:'none', fontSize:'14px', color:'#0004FF', fontWeight:'bold', padding:'0 8px'}}  >수정</Button>
      <Button danger onClick={handleDelete}
        style={{border:'none', fontSize:'14px', color:'#ff0000', fontWeight:'bold', padding:'0 8px'}} >삭제</Button>

      {/* 수정 모달 */}
      <RoutineEditorModal  routine={routine} visible={visible} onClose={() => { setVisible(false); onRefresh(); }}
      />
    </Space>
  );
};

export default RoutineActionButtons;
