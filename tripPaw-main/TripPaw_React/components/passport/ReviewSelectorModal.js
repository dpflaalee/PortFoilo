import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SealSelectorModal from './SealSelectorModal'; // 필요 시 컴포넌트 경로 맞게 조정

const ReviewSelectorModal = ({ memberId, passportId, onClose, onSaved }) => {
  const [reviews, setReviews] = useState([]);
  const [reservsNoReview, setReservsNoReview] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    axios.get(`/review/member/${memberId}/place-type`)
      .then((res) => {console.log('작성된 리뷰 응답:', res.data); setReviews(res.data);})
      .catch((err) => console.error('작성된 리뷰 조회 실패:', err));

    axios.get(`/review/tripplans-no-review/${memberId}`)
      .then((res) => {console.log('작성 안된 리뷰 응답:', res.data); setReservsNoReview(res.data);})
      .catch((err) => console.error('작성 안한 여행 조회 실패:', err));
  }, [memberId]);


const handleReviewSelect = (item) => {
  // tripPlanId는 리뷰의 대상 여행 식별자
  const tripPlanId = item?.targetId;
  const reviewId = item?.reviewId || item?.id;

  setSelectedReview({
    ...item,
    id: reviewId,
    tripPlanId,
  });
};

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          width: 100%;
          max-width: 640px;
          height: 90vh;
          background: #fff;
          overflow-y: auto;
          padding: 50px 60px;
          box-sizing: border-box;
          border-radius: 8px;
        }
        .review-card {
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }
        .review-card:hover {
          background-color: #f9f9f9;
        }
      `}</style>

<div className="modal-overlay">
  <div className="modal-content">
    <h3 style={{ marginBottom: '16px' }}>도장 연결할 리뷰 선택</h3>

    {/* 작성된 리뷰 영역 */}
    <section style={{ marginBottom: '32px' }}>
      <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>선택 가능 항목</h4>

      {reviews.length === 0 && <p>작성된 리뷰가 없습니다.</p>}

      {reviews.map((item, index) => (
        <div key={`review-${index}`} className="review-card">
          <p><strong>{item.titleOverride || '제목 없음'}</strong></p>
          <p>{item.content}</p>
          <small>날씨: {item.weatherCondition} / 평점: {item.rating}</small><br />
          <small>작성일: {item.createdAt}</small><br />
          <button onClick={() => handleReviewSelect(item)} style={{ marginTop: '8px' }}>도장 연결</button>
        </div>
      ))}
    </section>

    {/* 작성되지 않은 리뷰 영역 */}
    <section>
      <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>아직 리뷰를 작성하지 않았어요!</h4>

      {reservsNoReview.length === 0 && <p>모든 여행에 리뷰가 작성되었습니다.</p>}

      {reservsNoReview.map((item, index) => (
        <div key={`unwritten-${index}`} className="review-card">
          <p><strong>{item.titleOverride || '여행명 없음'}</strong> ({item.startDate} ~ {item.endDate})</p>
          <small style={{ display: 'block', marginBottom: '8px' }}>리뷰가 아직 없습니다.</small>
          <button onClick={() => window.location.href = `/tripPlan/${item.tripPlan.id}`}>리뷰 작성하러 가기</button>
        </div>
      ))}
    </section>

    {/* SealSelectorModal */}
    {selectedReview && (
      <SealSelectorModal
        passportId={passportId}
        review={selectedReview}
        tripPlanId={selectedReview?.targetId} 
        onClose={() => setSelectedReview(null)}
        onSaved={onSaved}
      />
    )}

    <button onClick={onClose}
      style={{ marginTop: '24px', display: 'block', border: '2px solid #000', fontWeight: 'bold', backgroundColor: '#fff', width: '100%', padding: '10px', borderRadius: '5px', fontSize: '16px', }}
    > 닫기 </button>
  </div>
</div>
    
    
</>);
};

export default ReviewSelectorModal;
