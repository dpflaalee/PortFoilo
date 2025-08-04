import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { useRouter } from 'next/router';
import ContentHeader from '../../components/ContentHeader';
import { RightOutlined } from '@ant-design/icons';
import PetAssistant from '../../components/pet/petassistant';
import { Select } from 'antd';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 100px 20px 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
`;

const YearMonthTitle = styled.h2`
  font-size: 1.6rem;
  margin: 2rem 0 1rem;
  border-bottom: 2px solid #444;
  padding-bottom: 0.3rem;
  color: #222;
  cursor: pointer;
  user-select: none;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 왼쪽 텍스트
const YearMonthText = styled.span`
  user-select: none;
`;

// 오른쪽 드롭박스 + 아이콘 감싸는 컨테이너
const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LeftTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StyledSelect = styled(Select)`
  width: 140px !important;
  font-weight: 600;
  .ant-select-selector {
    height: 30px !important;
    display: flex !important;
    align-items: center !important;
    border-radius: 6px !important;
    border: 1.8px solid #2563eb !important; /* 파란색 테두리 */
    background: #f0f7ff !important; /* 연한 파란 배경 */
    padding: 0 10px !important;
    font-size: 1rem !important;
    color: #1e40af !important;
    transition: border-color 0.3s;
  }
  &:hover .ant-select-selector {
    border-color: #1e3a8a !important;
  }
  .ant-select-arrow {
    color: #2563eb !important;
    font-weight: bold;
    font-size: 1.1rem;
  }
`;

const ArrowIcon = styled(RightOutlined)`
  font-weight: 300;
  font-size: 1.2rem;
  color: #444;
  transition: transform 0.2s ease;
  user-select: none;
  cursor: pointer;
`;

const ReservCard = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.1);
  margin-bottom: 1rem;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReservDate = styled.div`
  font-weight: 600;
  color: #555;
`;

const ReservPlaceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 1rem;
  color: #333;
`;

const PlaceInfoLeft = styled.div`
  flex-grow: 1;
`;

const PlaceInfoRight = styled.div`
  display: flex;
  flex-direction: column;  // 세로 정렬
  align-items: flex-end;
  gap: 8px;
`;

const StatusWrapper = styled.div`
  margin-bottom: 6px;
`;

const StatusBadge = styled.span`
  padding: 2px 6px;
  font-size: 0.8rem;
  border-radius: 6px;
  background-color: ${({ state }) =>
    state === 'WAITING' ? '#facc15' :
      state === 'CANCELLED' ? '#f87171' :
        state === 'EXPIRED' ? '#9ca3af' :
          '#34d399'};
  color: #fff;
  font-weight: 600;
  line-height: 1;
  margin-left: 8px;
  vertical-align: middle;
`;

const Button = styled.button`
  background-color: ${({ danger }) => danger ? '#e11d48' : '#2563eb'};
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ danger }) => danger ? '#b91c1c' : '#1e40af'};
  }
`;

const Footer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 100;
`;

const BottomButton = styled.button`
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  color: white;
  padding: 12px 28px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1rem;
  min-width: 150px;
  height: 48px;
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #3b82f6, #4f46e5);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.6);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  @media (max-width: 480px) {
    min-width: 120px;
    padding: 10px 20px;
    font-size: 1rem;
  }
`;

const MutedText = styled.span`
  color: #888;
  font-style: italic;
`;

const Message = styled.p`
  text-align: center;
  margin-top: 80px;
  color: #666;
`;

const Error = styled(Message)`
  color: #e11d48;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.2s ease-out forwards;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  animation: ${fadeIn} 0.2s ease-out forwards;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #111;
`;

const ModalContent = styled.div`
  color: #444;
  line-height: 1.6;
  margin-bottom: 20px;

  p {
    margin: 0.5rem 0;
  }
`;

const statusMap = {
  WAITING: '결제 대기중',
  CONFIRMED: '예약 완료',
  CANCELLED: '예약 취소',
  EXPIRED: '예약 만료',
};
const { Option } = Select;

function groupByYearMonth(reservations) {
  return reservations.reduce((acc, reserv) => {
    const date = new Date(reserv.startDate);
    const yearMonth = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    if (!acc[yearMonth]) acc[yearMonth] = [];
    acc[yearMonth].push(reserv);
    return acc;
  }, {});
}

const ReservList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReserv, setSelectedReserv] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const router = useRouter();
  const { tripPlanId } = router.query;
  const [openedSections, setOpenedSections] = useState({});
  const [latestState, setLatestState] = useState(null);

  // 각 연월별 상태 필터 관리
  const [sectionStatusFilters, setSectionStatusFilters] = useState({});

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('/reserv', {
          withCredentials: true,
        });
        setReservations(response.data);

        if (response.data.length > 0) setLatestState(response.data[0].state);
        else setLatestState(null);

        const grouped = groupByYearMonth(response.data);
        const defaultOpened = {};
        Object.keys(grouped).forEach((key) => {
          defaultOpened[key] = true;
        });
        setOpenedSections(defaultOpened);
      } catch (err) {
        setError('예약 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    if (reservations.length > 0) {
      setLatestState(reservations[0].state);
    } else {
      setLatestState(null);
    }
  }, [reservations]);

  const cancelReservaBymemberTripPlanId = (memberTripPlanId) => {
    // 1. tripPlanId로 예약들을 필터링
    const reservationsToCancel = reservations.filter(r => r.memberTripPlanId === memberTripPlanId);

    // 2. 필터링된 예약들의 상태를 CANCELLED로 업데이트
    setReservations(prevReservations => {
      return prevReservations.map(r =>
        reservationsToCancel.some(reservation => reservation.id === r.id)
          ? { ...r, state: 'CANCELLED' }
          : r
      );
    });
  };

  const cancelSingleReserv = async (reservId) => {
    if (!window.confirm('정말 예약을 취소하시겠습니까?')) return;

    try {
      await axios.post(`/reserv/${reservId}/delete`, null, { withCredentials: true });
      alert('예약이 취소되었습니다.');

      setReservations(prevReservations =>
        prevReservations.map(r =>
          r.id === reservId ? { ...r, state: 'CANCELLED' } : r
        )
      );
    } catch (err) {
      alert('예약 취소에 실패했습니다.');
    }
  };

  const cancelTripPlanReservs = async (memberTripPlanId) => {
    if (!window.confirm('일괄 예약 전체를 취소하시겠습니까?')) return;

    try {
      // 해당 memberTripPlanId에 속한 모든 예약을 필터링하여 예약 ID만 추출
      const reservIdsToCancel = reservations
        .filter(reserv => reserv.memberTripPlanId === memberTripPlanId)
        .map(reserv => reserv.id);

      if (reservIdsToCancel.length === 0) {
        alert('취소할 예약이 없습니다.');
        return;
      }

      // 서버로 배치 취소 요청
      await axios.post(
        `/reserv/batch/cancel`,
        { reservIds: reservIdsToCancel, memberTripPlanId },
        { withCredentials: true }
      );

      alert('일괄 예약 전체가 취소되었습니다.');

      // 상태 업데이트 (예약 취소 처리)
      setReservations(prevReservations =>
        prevReservations.map(r =>
          r.memberTripPlanId === memberTripPlanId
            ? { ...r, state: 'CANCELLED' }
            : r
        )
      );
    } catch (err) {
      alert('일괄 예약 취소에 실패했습니다.');
    }
  };

  const toggleSection = (yearMonth) => {
    setOpenedSections(prev => ({
      ...prev,
      [yearMonth]: !prev[yearMonth]
    }));
  };

  const viewReservDetail = (reserv) => {
    setSelectedReserv(reserv);
    setIsDetailModalOpen(true);
  };

  const goToPayPage = (reserv) => {
    const query = new URLSearchParams({
      reservId: reserv.id,
      memberId: reserv.member?.id || '',
      countPeople: reserv.countPeople?.toString() || '1',
      countPet: reserv.countPet?.toString() || '0',
      startDate: reserv.startDate,
      endDate: reserv.endDate,
      amount: (reserv.amount || 10000).toString(),
    }).toString();

    router.push(`/pay/pay?${query}`);
  };

  const closeDetailModal = () => {
    setSelectedReserv(null);
    setIsDetailModalOpen(false);
  };

  const cancelReservInModal = async (reservId) => {
    if (!window.confirm('정말 예약을 취소하시겠습니까?')) return;

    try {
      await axios.post(`/reserv/${reservId}/delete`, null, {
        withCredentials: true,
      });
      alert('예약이 취소되었습니다.');
      setReservations(prev =>
        prev.map(r => (String(r.memberTripPlan?.id || r.memberTripPlan?.id) === String(memberTripPlanId) ? { ...r, state: 'CANCELLED' } : r))
      );
      closeDetailModal();
    } catch (err) {
      alert('예약 취소에 실패했습니다.');
    }
  };

  if (loading) return <Message>불러오는 중...</Message>;
  if (error) return <Error>{error}</Error>;
  if (reservations.length === 0) return <Message>예약 내역이 없습니다.</Message>;

  const groupedReservations = groupByYearMonth(reservations);

  return (
    <>
      <ContentHeader theme="dark" />
      <Wrapper>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <Title>예약 내역</Title>
        </div>

        {Object.entries(groupedReservations).map(([yearMonth, reservs]) => {
          const selectedStatus = sectionStatusFilters[yearMonth] || 'ALL';

          const filteredReservs = selectedStatus === 'ALL'
            ? reservs
            : reservs.filter(r => r.state === selectedStatus);

          if (filteredReservs.length === 0) return null; // 해당 월에 필터 결과 없으면 숨김

          return (
            <section key={yearMonth}>
              <YearMonthTitle>
                <YearMonthText onClick={() => toggleSection(yearMonth)}>{yearMonth}</YearMonthText>

                <RightControls onClick={e => e.stopPropagation()}>
                  <StyledSelect
                    size="small"
                    value={selectedStatus}
                    onChange={(value) => setSectionStatusFilters(prev => ({ ...prev, [yearMonth]: value }))}
                    options={[
                      { label: '전체', value: 'ALL' },
                      { label: '결제 대기중', value: 'WAITING' },
                      { label: '예약 완료', value: 'CONFIRMED' },
                      { label: '예약 취소', value: 'CANCELLED' },
                      { label: '예약 만료', value: 'EXPIRED' },
                    ]}
                  />
                  <ArrowIcon
                    onClick={() => toggleSection(yearMonth)}
                    style={{ transform: openedSections[yearMonth] ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  />
                </RightControls>
              </YearMonthTitle>

              {openedSections[yearMonth] && filteredReservs.map((reserv) => (
                <ReservCard key={reserv.id}>
                  <td>
                    {reserv.startDate} ~ {reserv.endDate}
                    <StatusBadge state={reserv.state}>
                      {statusMap[reserv.state] || reserv.state}
                    </StatusBadge>
                  </td>
                  <ReservPlaceInfo>
                    <PlaceInfoLeft>
                      <div><strong>{reserv.place?.name}</strong></div>
                      <div>{reserv.place?.region}</div>
                    </PlaceInfoLeft>

                    <PlaceInfoRight>
                      {reserv.state === 'WAITING' && (
                        <>
                          <Button onClick={() => goToPayPage(reserv)}>결제하기</Button>
                          <Button
                            danger
                            onClick={() => {
                              if (reserv.memberTripPlanId) {
                                cancelTripPlanReservs(reserv.memberTripPlanId);
                              } else {
                                cancelSingleReserv(reserv.id);
                              }
                            }}
                          >
                            예약 취소
                          </Button>
                        </>
                      )}
                      {reserv.state !== 'WAITING' && reserv.state !== 'CANCELLED' && reserv.state !== 'EXPIRED' && (
                        <Button onClick={() => viewReservDetail(reserv)}>상세보기</Button>
                      )}
                    </PlaceInfoRight>
                  </ReservPlaceInfo>
                </ReservCard>
              ))}
            </section>
          );
        })}

        {isDetailModalOpen && selectedReserv && (
          <ModalOverlay onClick={closeDetailModal}>
            <Modal onClick={(e) => e.stopPropagation()}>
              <ModalTitle>예약 상세 정보</ModalTitle>
              <ModalContent>
                <p><strong>예약 ID:</strong> {selectedReserv.id}</p>
                <p><strong>사용자:</strong> {selectedReserv.member?.username}</p>
                <p><strong>장소:</strong> {selectedReserv.place?.name}</p>
                <p><strong>주소:</strong> {selectedReserv.place?.region}</p>
                <p><strong>시작일:</strong> {selectedReserv.startDate}</p>
                <p><strong>종료일:</strong> {selectedReserv.endDate}</p>
                <p><strong>사람 수:</strong> {selectedReserv.countPeople}</p>
                <p><strong>반려동물 수:</strong> {selectedReserv.countPet}</p>
                <p><strong>상태:</strong> {statusMap[selectedReserv.state] || selectedReserv.state}</p>
              </ModalContent>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedReserv.state === 'CONFIRMED' && (
                  <Button
                    danger
                    onClick={() => {
                      if (selectedReserv.memberTripPlanId) {
                        cancelTripPlanReservs(selectedReserv.memberTripPlanId);
                      } else {
                        cancelSingleReserv(selectedReserv.id);
                      }
                      closeDetailModal();
                    }}
                  >
                    예약 취소
                  </Button>
                )}

                <Button fullWidth onClick={closeDetailModal}>
                  닫기
                </Button>
              </div>
            </Modal>
          </ModalOverlay>
        )}
        <PetAssistant reservState={latestState} />
        <Footer>
          <BottomButton onClick={() => router.push('/')}>홈으로</BottomButton>
          <BottomButton onClick={() => router.push('/pay/paylist')}>결제 내역 보기</BottomButton>
        </Footer>
      </Wrapper>
    </>
  );
};

export default ReservList;
