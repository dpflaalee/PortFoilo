import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Rate, Button, Image, Modal, message, Pagination } from 'antd';
import { CloseOutlined, QuestionOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const { TabPane } = Tabs;
const PAGE_SIZE = 5;

const MyReviewList = ({ memberId }) => {
  const [reviews, setReviews] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [activeTab, setActiveTab] = useState('PLAN');
  const router = useRouter();

  useEffect(() => {
    if (memberId) {
      fetchReviews(currentPage, activeTab);
    }
  }, [memberId, currentPage, activeTab]);

  const fetchReviews = async (page, type) => {
    try {
      const res = await axios.get(`/review/member/${memberId}`, {
        params: { page, size: PAGE_SIZE, type },
      });
      setReviews(res.data.content);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error('리뷰 불러오기 실패', err);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(0);
  };

  const handleEdit = (reviewId) => {
    router.push(`/review/${reviewId}/edit`);
  };

  const handleDelete = async (reviewId) => {
    Modal.confirm({
      title: '리뷰를 삭제하시겠습니까?',
      content: '삭제된 리뷰는 복구할 수 없습니다.',
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          await axios.delete(`/review/${reviewId}`);
          message.success('리뷰가 삭제되었습니다.');
          fetchReviews(currentPage, activeTab);
        } catch (err) {
          console.error('삭제 실패', err);
          message.error('리뷰 삭제에 실패했습니다.');
        }
      },
    });
  };

  const getWeatherImageFileName = (condition) => {
    switch (condition) {
      case '맑음':
        return 'sun.png';
      case '흐림':
        return 'cloudy.png';
      case '비':
        return 'rain.png';
      case '눈':
        return 'snow.png';
      case '구름많음':
        return 'mostly-cloudy.png';
      default:
        return null;
    }
  };

  const renderReviewCard = (review) => {
    const isPlace = review.reviewType === 'PLACE';
    return (
      <div key={review.reviewId} style={{ padding: 16, background: '#fff', borderRadius: 8, marginBottom: 32, position: 'relative' }}>
        <div style={{ marginBottom: 12, borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
          {isPlace ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Image src={review.placeImageUrl} width={60} height={60} style={{ borderRadius: 8 }} />
              <div>
                <div
                  style={{ fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}
                  onClick={() => router.push(`/place/${review.targetId}`)}
                >
                  {review.placeName}
                </div>
                <div style={{ color: '#999', fontSize: 13 }}>장소 리뷰</div>
              </div>
            </div>
          ) : (
            <div
              style={{ fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}
              onClick={() => router.push(`/review/tripPlan/${review.targetId}`)}
            >
              {review.tripTitle || '제목 없음'}
            </div>
          )}
        </div>

        <div style={{ marginTop: 8 }}>
          <Rate disabled value={review.rating} style={{ fontSize: 16 }} />
          <span style={{ marginLeft: 12, color: '#aaa', fontSize: 13 }}>{review.createdAt}</span>
          <div style={{ marginTop: 8 }}>{review.content}</div>

          {review.imageUrl && (
            <div style={{ marginTop: 12, position: 'relative' }}>
              <Image
                src={`/upload/reviews/${review.imageUrl}`}
                width={100}
                height={100}
                style={{ objectFit: 'cover', borderRadius: 6 }}
              />
              {review.imageCount > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: 4,
                  left: 4,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontSize: 12,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}>
                  {review.imageCount}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          {getWeatherImageFileName(review.weatherCondition) ? (
            <img
              src={`/image/weather/${getWeatherImageFileName(review.weatherCondition)}`}
              alt={review.weatherCondition}
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <QuestionOutlined style={{ color: '#aaa', fontSize: 24 }} />
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <Button size="small" onClick={() => handleEdit(review.reviewId)}>수정하기</Button>
          <CloseOutlined
            onClick={() => handleDelete(review.reviewId)}
            style={{ marginLeft: 12, cursor: 'pointer', fontSize: 16, color: '#888' }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="장소리뷰" key="PLACE">
          {reviews.map(renderReviewCard)}
        </TabPane>
        <TabPane tab="경로리뷰" key="PLAN">
          {reviews.map(renderReviewCard)}
        </TabPane>
      </Tabs>
      <Pagination
        current={currentPage + 1}
        pageSize={PAGE_SIZE}
        total={totalElements}
        onChange={(page) => setCurrentPage(page - 1)}
        style={{ textAlign: 'center', marginTop: 24 }}
        showSizeChanger={false}
      />
    </>
  );
};

export default MyReviewList;
