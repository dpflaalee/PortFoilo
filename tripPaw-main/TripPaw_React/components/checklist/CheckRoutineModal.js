import { Modal, Collapse, List, Input, Checkbox, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { getTemplates, getTemplateWithItems, } from '@/api/checkTemplate';
import { useRouter } from 'next/router';
import { getRoutinesByMember, getMemberChecksByRoutineId, createRoutineFromTemplates, } from '@/api/memberCheck';

export default function CheckRoutineModal({ open, onClose, memberId, memberTripPlanId }) {
  const [adminTemplates, setAdminTemplates] = useState([]);
  const [myRoutines, setMyRoutines] = useState([]);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
  const [routineTitle, setRoutineTitle] = useState('');
  const [savePersonalRoutine, setSavePersonalRoutine] = useState(true);
  const [creating, setCreating] = useState(false);
  const [tripPlanTitle, setTripPlanTitle] = useState('');
  const [tripStartDate, setTripStartDate] = useState('');
  const [tripEndDate, setTripEndDate] = useState('');
  const [countPeople, setCountPeople] = useState(0);
  const [countPet, setCountPet] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      // 관리자 템플릿 + 항목 병합
      getTemplates().then(async (templates) => {
        const enriched = await Promise.all(
          templates.map(async (t) => {
            const detail = await getTemplateWithItems(t.id);
            return {
              id: t.id,
              title: t.title ?? detail.title,
              items: detail.items,
            };
          }));
        setAdminTemplates(enriched);
      });

      // 사용자 루틴 + 항목 병합
      getRoutinesByMember(memberId).then(async (routines) => {
        const enriched = await Promise.all(
          routines.map(async (r) => {
            const items = await getMemberChecksByRoutineId(r.id);
            return { ...r, items };
          })
        );
        setMyRoutines(enriched);
      });

      setSelectedTemplateIds([]);
      setRoutineTitle('');
    }
  }, [open]);

  useEffect(() => { //여행정보 가져오는용
    if (open && memberTripPlanId) {
      fetch(`/memberTripPlan/${memberTripPlanId}`, {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          setTripPlanTitle(data.title ?? '제목 없음');
          setTripStartDate(data.startDate ?? '');
          setTripEndDate(data.endDate ?? '');
          setCountPeople(data.countPeople ?? 0);
          setCountPet(data.countPet ?? 0);
        })
        .catch((err) => {
          console.error('여행 정보 가져오기 실패:', err);
        });
    }
  }, [open, memberTripPlanId]);

  const toggleTemplate = (id) => {
    setSelectedTemplateIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);
  };

  const handleCreate = async () => {
    if (!routineTitle.trim()) { message.warning('루틴 제목을 입력해주세요'); return; }
    if (!selectedTemplateIds.length) { message.warning('템플릿을 선택해주세요'); return; }

    setCreating(true);
    try {
      await createRoutineFromTemplates({
        memberId, memberTripPlanId, templateIds: selectedTemplateIds, title: routineTitle, isSaved: savePersonalRoutine,
      });
      message.success('체크리스트가 생성되었습니다');
      onClose();
      router.push(`/mypage/checklist/mychecklist/${memberId}`)
    } catch (err) {
      console.error(err); message.error('체크리스트 생성 실패');
    } finally { setCreating(false); }
  };


  return (
    <Modal open={open} onCancel={onClose} footer={null} width={720}>
      <div style={{ padding: '28px 48px' }}>
        <h2 style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#653131' }}> {tripPlanTitle}</h2>
        <div style={{ display: 'flex', color: '#6d6d6d' }}>
          <p style={{ paddingRight: '10px', borderRight: '1px solid #a9a9a9' }}>{countPeople}인 {countPet}마리</p>
          <p style={{ paddingLeft: '10px' }}>{tripStartDate} ~ {tripEndDate}</p>
        </div>
        <Input value={routineTitle} onChange={(e) => setRoutineTitle(e.target.value)}
          placeholder="체크리스트 제목을 입력해주세요" style={{ margin: '12px 10px 25px 0', borderWidth: '0 0 2px', padding: '0.5em' }}
        />

        <Collapse accordion style={{ background: 'transparent', border: 'none' }}>
          {/* 관리자 체크리스트 */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>기본 체크리스트</p>
            {adminTemplates.map((template) => (
              <Collapse key={template.id} expandIconPosition="end" style={{ background: 'transparent', border: 'none' }}>
                <Collapse.Panel header={
                  <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    <Checkbox checked={selectedTemplateIds.includes(template.id)} onChange={() => toggleTemplate(template.id)} style={{ marginRight: '8px' }} />
                    {template.title}
                  </div>
                }
                  key={`template-${template.id}`} style={{ borderBottom: 'none' }}
                >
                  <List style={{ borderTop: 'none' }} dataSource={template.items} renderItem={(item) => <List.Item style={{ padding: '0 0 10px 18px', border: 'none' }}>{item.content}</List.Item>}
                  />
                </Collapse.Panel>
              </Collapse>
            ))}
          </div>
          {/* 나의 체크리스트 */}
          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>내 체크리스트</p>
          {myRoutines.map((routine) => (
            <Collapse key={routine.id} expandIconPosition="end" style={{ background: 'transparent', border: 'none' }}>
              <Collapse.Panel header={
                <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                  <Checkbox style={{ marginRight: '8px' }} />
                  {routine.title}
                </div>
              } key={`routine-${routine.id}`} style={{ borderBottom: 'none', marginBottom: '18px' }}
              >
                <List style={{ borderTop: 'none' }} dataSource={routine.items} renderItem={(item) => (
                  <List.Item style={{ padding: '0 0 10px 18px', border: 'none' }}>
                    {item.customContent ?? item.checkTemplateItem?.content}
                  </List.Item>
                )}
                />
              </Collapse.Panel>
            </Collapse>
          ))}
        </Collapse>

        <Checkbox
          checked={savePersonalRoutine}
          onChange={(e) => setSavePersonalRoutine(e.target.checked)}
          style={{ marginTop: 16 }}
        >
          내 루틴으로도 저장하기
        </Checkbox>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button
            type="primary"
            style={{ marginTop: '18px', fontSize: '18px', fontWeight: 'bold', padding: '20px', lineHeight: 0, border: 'none', backgroundColor: '#000', color: '#fff' }}
            loading={creating}
            disabled={!routineTitle || !selectedTemplateIds.length}
            onClick={handleCreate}
          >체크리스트 생성</Button>
          <Button style={{ fontSize: '18px', fontWeight: 'bold', border: '2px solid #a9a9a9', backgroundColor: 'none', padding: '20px', lineHeight: 0, marginTop: '8px' }} onClick={onClose}>취소</Button>
        </div>
      </div>
    </Modal>
  );
}
