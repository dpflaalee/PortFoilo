import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../style/PayList.module.css';
import ContentHeader from '../../components/ContentHeader';
import { CloseOutlined, RightOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import styled from 'styled-components';

// 아이콘을 회전시키기 위한 스타일드 컴포넌트
const ArrowIcon = styled(RightOutlined)`
  font-weight: 300;
  font-size: 1.1rem;
  color: #444;
  transition: transform 0.2s ease;
  user-select: none;
`;

// 년월 제목 스타일 (flex로 아이콘 오른쪽 끝 배치)
const YearMonthTitle = styled.h2`
  font-size: 1.4rem;
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

const stateMap = {
  PAID: '결제 완료',
  CANCELLED: '결제 취소',
  REFUNDED: '환불 완료',
};

// groupId로 그룹화하는 함수
function groupByGroupId(payments) {
  return payments.reduce((acc, pay) => {
    const groupId = pay.groupId || 'single'; // groupId가 없으면 single로 처리
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(pay);
    return acc;
  }, {});
}

const PayList = () => {
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [openedSections, setOpenedSections] = useState({});

  const openDetailModal = (payment) => {
    setSelectedPayment(payment);
    setModalVisible(true);
  };

  const closeDetailModal = () => {
    setSelectedPayment(null);
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('/pay', {
          withCredentials: true,
        });
        setPayments(response.data);

        // 기본적으로 모든 년월을 펼치도록 설정 (원하면 false로 바꿀 수 있음)
        const grouped = groupByGroupId(response.data); // groupId로 그룹화
        const initOpen = {};
        Object.keys(grouped).forEach((key) => {
          initOpen[key] = true;
        });
        setOpenedSections(initOpen);
      } catch (err) {
        setError('결제 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const toggleSection = (groupId) => {
    setOpenedSections((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const cancelPayment = async (payId) => {
    if (!confirm('결제를 취소하시겠습니까?')) return;
    try {
      await axios.post(`/pay/${payId}/cancel`, null, {
        withCredentials: true,
      });
      alert('결제가 취소되었습니다.');
      setPayments((prev) =>
        prev.map((p) =>
          p.id === payId ? { ...p, state: 'CANCELLED' } : p
        )
      );
    } catch (err) {
      alert('결제 취소에 실패했습니다.');
    }
  };

  const refundPayment = async (pay) => {
    if (!window.confirm('정말 환불하시겠습니까?')) return;
    try {
      await axios.post(`/pay/${pay.impUid}/refund`, null, {
        withCredentials: true,
      });
      alert('환불이 완료되었습니다.');
      setPayments((prev) =>
        prev.map((p) =>
          p.id === pay.id ? { ...p, state: 'REFUNDED' } : p
        )
      );
    } catch (error) {
      alert('환불 처리에 실패했습니다.');
    }
  };

  if (loading) return <p className={styles.loading}>불러오는 중...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (payments.length === 0) return <p className={styles.empty}>결제 내역이 없습니다.</p>;

  const groupByYearMonth = (payments) => {
    return payments.reduce((acc, pay) => {
      const date = new Date(pay.created_at);  // 결제 시간을 기준으로 년월 구분
      const yearMonth = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;  // 년/월 포맷

      if (!acc[yearMonth]) acc[yearMonth] = [];
      acc[yearMonth].push(pay);
      return acc;
    }, {});
  };

  const groupedPayments = groupByYearMonth(payments);

  return (
    <>
      <ContentHeader theme="dark" />
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>결제 내역</h2>
          <CloseOutlined
            className={styles.closeIcon}
            onClick={() => router.push('/reserv/reservlist')}
            aria-label="예약 내역으로 이동"
          />
        </div>

        {Object.entries(groupedPayments).map(([yearMonth, pays]) => (
          <section key={yearMonth}>
            <YearMonthTitle onClick={() => toggleSection(yearMonth)}>
              <span>{yearMonth}</span>
              <ArrowIcon
                style={{
                  transform: openedSections[yearMonth] ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              />
            </YearMonthTitle>

            {openedSections[yearMonth] &&
              pays.map((pay) => (
                <div key={pay.id} className={styles.receipt}>
                  <div className={styles.receiptHeader}>
                    <div className={styles.headerLeft}>
                      <h2>{pay.reserv?.place?.name}</h2>
                    </div>

                    <div className={styles.headerRight}>
                      <small>{new Date(pay.paidAt).toLocaleString()}</small>
                      <button
                        className={styles.detailBtn}
                        onClick={() => openDetailModal(pay)}
                      >
                        상세 보기
                      </button>
                    </div>
                  </div>
                  <div className={styles.receiptBody}>
                    <p><strong>결제 상태:</strong> {stateMap[pay.state] || pay.state}</p>
                    <p><strong>결제 금액:</strong> {pay.amount.toLocaleString()}원</p>
                    <p><strong>결제 수단:</strong> {pay.payMethod}</p>
                  </div>
                  <div className={styles.receiptFooter}>
                    {pay.reserv?.state === 'CANCELLED' ? (
                      <>
                        {pay.state === 'PAID' && (
                          <button
                            onClick={() => cancelPayment(pay.id)}
                            className={styles.cancelBtn}
                          >
                            결제 취소
                          </button>
                        )}
                        {pay.state === 'CANCELLED' && (
                          <button
                            onClick={() => refundPayment(pay)}
                            className={styles.refund}
                          >
                            환불 처리
                          </button>
                        )}
                        {pay.state === 'REFUNDED' && (
                          <span className={styles.refundedBadge}>환불 완료</span>
                        )}
                      </>
                    ) : (
                      <span className={styles.infoText}>예약 취소 후 이용 가능</span>
                    )}
                  </div>
                </div>
              ))}
          </section>
        ))}

        <Modal
          title="결제 상세 내역"
          visible={modalVisible}
          onCancel={closeDetailModal}
          footer={null}
        >
          {selectedPayment && (
            <div>
              <p><strong>결제 ID:</strong> {selectedPayment.id}</p>
              <p><strong>예약 ID:</strong> {selectedPayment.reserv?.id || '-'}</p>
              <p><strong>결제 번호:</strong> {selectedPayment.impUid}</p>
              <p><strong>결제자:</strong> {selectedPayment.member?.username}</p>
              <p><strong>결제 상태:</strong> {stateMap[selectedPayment.state] || selectedPayment.state}</p>
              <p><strong>결제 금액:</strong> {selectedPayment.amount.toLocaleString()}원</p>
              <p><strong>결제 수단:</strong> {selectedPayment.payMethod}</p>
              <p><strong>PG사:</strong> {selectedPayment.pgProvider}</p>
              <p><strong>결제 시간:</strong> {new Date(selectedPayment.paidAt).toLocaleString()}</p>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default PayList;
