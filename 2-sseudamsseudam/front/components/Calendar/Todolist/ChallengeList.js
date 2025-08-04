import React, { useEffect, useState } from 'react';
import { Divider, Button, message, Modal } from 'antd';
import { useRouter } from 'next/router';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import weekday from 'dayjs/plugin/weekday';
import ChallengeCalendar from '../Todolist/ChallengeCalendar';
import ChallengeCategory from '@/components/Calendar/Todolist/ChallengeCategory';

dayjs.locale('ko');
dayjs.extend(weekday);

const dateView = { color: '#807E7E' };
const dateStyle = { color: '#807E7E', fontSize: '13px', marginBottom: '3%', display: 'block', verticalAlign: 'middle' };

// '챌린지' 판별
const isChallengeTitle = (title) => {
  return typeof title === 'string' && title.includes('챌린지');
};

const ChallengeList = () => {
  const router = useRouter();
  const [schedules, setSchedules] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3065/user', { withCredentials: true });
        setIsAdmin(Number(res.data.isAdmin) === 1);
      } catch (error) {  setIsAdmin(false);    }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get('http://localhost:3065/calendar');
        // '챌린지' 키워드가 title에 포함된 스케줄만 필터링
        const filteredSchedules = res.data.filter(schedule => isChallengeTitle(schedule.title));
        const sortedSchedules = filteredSchedules.sort((a, b) =>
          dayjs(a.startDate).isBefore(dayjs(b.startDate)) ? -1 : 1
        );
        setSchedules(sortedSchedules);
      } catch (error) {
        message.error('챌린지 데이터를 불러오지 못했습니다.');
      }
    };
    fetchSchedules();
  }, []);

  const handleAddEvent = () => router.push('/challenge/regichallenge');
  const handleChangeEvent = (id) => router.push(`/challenge/editchallenge?id=${id}`);

  const SeeMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const showModal = () => { setIsModalOpen(true); };
  const handleOk = () => { setIsModalOpen(false); };
  const handleCancel = () => { setIsModalOpen(false); };

  const handleDeleteEvent = async (id) => {
    const isConfirmed = window.confirm('챌린지를 삭제하시겠습니까?');
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3065/calendar/${id}`);
        message.success('챌린지가 삭제되었습니다.');
        setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
      } catch (error) {
        message.error('챌린지 삭제에 실패했습니다.');
      }
    }
  };

  const formatRange = (start, end) => {
    const format = 'YY.MM.DD(dd)';
    return `${dayjs(start).format(format)} ~ ${dayjs(end).format(format)}`;
  };

  return (
    <>
      <style>{`
        h3 {
          font-size: 20px;
          font-weight: bold;
        }
        .ant-divider-horizontal {
          margin: 15px 0;
        }
      `}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          backgroundColor: '#ffffff',
          padding: '20px 100px 25px 100px',
        }}>
        <div style={{ display: 'flex' }}>
          <h3 style={{ marginBottom: '0px' }}>
            {isAdmin? '진행 중인 챌린지' : '내 챌린지 참여현황'}<br />
          </h3>
          {isAdmin && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: 'auto',
                gap: '10px',
              }}>
              <Button type="primary" onClick={handleAddEvent}>챌린지 생성</Button>
            </div>
          )}
        </div>
        <Divider />

        {schedules.slice(0, visibleCount).map((schedule) => (
          <div key={schedule.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
              }}>
              <div style={{ display: 'inline' }}>
                <h3 style={{ display: 'inline', marginBottom: '-2%' }}>{schedule.title}</h3>
                <span style={dateStyle}>{formatRange(schedule.startDate, schedule.endDate)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}>
                {isAdmin && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: 'auto',
                      flexDirection: 'row',
                      gap: '10px',
                    }}>
                    <Button type="primary" onClick={() => handleChangeEvent(schedule.id)}>챌린지 수정</Button>
                    <Button onClick={() => handleDeleteEvent(schedule.id)}>챌린지 삭제</Button>
                  </div>
                )}
                {/* 
                {isAdmin || isCompleted ? 
                  <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: 'auto',
                      flexDirection: 'row',
                    }}>
                    <Button type="primary" onClick={() => {
                      setIsCompleted(true);
                      showModal(schedule.id);
                      }}>
                      보상 받기
                    </Button>
                    <Modal
                      title="챌린지 완료!"
                      closable={{ 'aria-label': 'Custom Close Button' }}
                      open={isModalOpen}
                      onOk={handleOk}
                      onCancel={handleCancel}
                    >
                      <p>달성 보상이 지급되었습니다.</p>
                    </Modal>
                  </div>
                  :
                  <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: 'auto',
                      flexDirection: 'row',
                    }}>
                    <Button type="primary" disabled onClick={() => {
                      setIsCompleted(false);
                      }}>
                      보상 받기
                    </Button>
                  </div>
                } 
                */}
              </div>
            </div>
            {isAdmin && <span style={dateView}>{schedule.content}</span>}
            <div style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}>
              {/* <ChallengeCalendar /> */}
            </div>
            <Divider />
          </div>
        ))}
        {visibleCount < schedules.length && (
          <Button type="primary" htmlType="button" block onClick={SeeMore}>더보기</Button>
        )}

        {/* 글쓰기 카테고리에서 챌린지 선택하기 기능 테스트용 */}
        {/* <ChallengeCategory /> */}
      </div>
    </>
  );
};

export default ChallengeList;
