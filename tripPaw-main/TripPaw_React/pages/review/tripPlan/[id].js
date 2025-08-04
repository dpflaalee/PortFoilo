import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/AppLayout';
import axios from 'axios';
import { Card, Rate, Spin, Button, Pagination } from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  CloudOutlined,
  SunOutlined,
  QuestionOutlined,
} from '@ant-design/icons';

const RouteMapNoSSR = dynamic(() => import('@/components/tripPlan/RouteMap'), { ssr: false });

const weatherIcon = (condition) => {
  switch (condition) {
    case '맑음':
      return <SunOutlined style={{ fontSize: 24, color: '#fadb14' }} />;
    case '흐림':
      return <CloudOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />;
    case '구름많음':
      return <CloudOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
    default:
      return <QuestionOutlined style={{ fontSize: 24, color: '#aaa' }} />;
  }
};

const ReviewTripPlanDetail = () => {
  const router = useRouter();
  const { id: planId, title } = router.query;
  const [reviews, setReviews] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [planTitle, setPlanTitle] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [likeStates, setLikeStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [canWriteReview, setCanWriteReview] = useState(false);
  const [page, setPage] = useState(0);
  const size = 10;

  useEffect(() => {
    if (!planId) return;

    const fetchInitial = async () => {
      try {
        const authRes = await axios.get('/api/auth/check', {
          withCredentials: true,
        });
        const loginMemberId = authRes.data.id;
        setIsLoggedIn(true);
        setMemberId(loginMemberId);

        const planRes = await axios.get(`/tripPlan/${planId}`);
        setRouteData(planRes.data.routeData || []);
        setPlanTitle(planRes.data.title || '');
      } catch (err) {
      }
    };

    fetchInitial();
  }, [planId]);

  useEffect(() => {
    if (!planId || memberId === null) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/review/plan/${planId}`, {
          params: { page, size },
        });

        const fetchedReviews = res.data.content || [];
        setReviews(fetchedReviews);
        setTotalElements(res.data.totalElements);
        setAverageRating(res.data.avgRating);

        const hasWritten = fetchedReviews.some((r) => r.memberId === memberId);
        setCanWriteReview(!hasWritten);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [planId, page, memberId]);

  useEffect(() => {
    if (!memberId || reviews.length === 0) return;

    const fetchLikeStates = async () => {
      const states = {};
      await Promise.all(
        reviews.map(async (review) => {
          try {
            const [markedRes, countRes] = await Promise.all([
              axios.get(`/review/${review.reviewId}/like/marked`, {
                params: { memberId },
                withCredentials: true,
              }),
              axios.get(`/review/${review.reviewId}/like/count`),
            ]);
            states[review.reviewId] = {
              liked: markedRes.data,
              count: countRes.data,
            };
          } catch (err) {
          }
        })
      );
      setLikeStates(states);
    };

    fetchLikeStates();
  }, [memberId, reviews]);

  const toggleLike = async (reviewId) => {
    if (!isLoggedIn || !memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    const current = likeStates[reviewId];
    try {
      if (current?.liked) {
        await axios.delete(`/review/${reviewId}/like`, {
          params: { memberId },
          withCredentials: true,
        });
        setLikeStates((prev) => ({
          ...prev,
          [reviewId]: { liked: false, count: prev[reviewId].count - 1 },
        }));
      } else {
        await axios.post(`/review/${reviewId}/like`, null, {
          params: { memberId },
          withCredentials: true,
        });
        setLikeStates((prev) => ({
          ...prev,
          [reviewId]: { liked: true, count: prev[reviewId].count + 1 },
        }));
      }
    } catch (err) {
    }
  };

  if (loading) return <Spin fullscreen />;

  return (
    <AppLayout>
      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            marginTop: 40,
            padding: '20px',
            paddingTop: '40px',
            borderBottom: '1px solid #eee',
            background: '#fff',
            zIndex: 1,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 24, textAlign: 'center' }}>{planTitle}</h1>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{  width: '50%', height: '100%' }}>
            <RouteMapNoSSR
              routeData={routeData}
              focusDay={null}
              setFocusDay={() => {}}
              setMapInstance={() => {}}
            />
          </div>

          <div style={{ flex: 1, padding: 20, overflowY: 'auto', height: '100%',  width: '50%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#f5222d', fontWeight: 600, fontSize: 16 }}>
                  {averageRating.toFixed(1)}{' '}
                  <Rate disabled allowHalf value={averageRating} style={{ fontSize: 16 }} />
                </span>
                <span style={{ marginLeft: 8, color: '#888' }}>리뷰 {totalElements}개</span>
              </div>
              {isLoggedIn && canWriteReview && (
                <Button
                  type="primary"
                  onClick={() =>
                    router.push({
                      pathname: '/review/write',
                      query: {
                        reviewTypeId: 1,
                        targetId: planId,
                        title: title || '',
                      },
                    })
                  }
                >
                  ✍ 리뷰 작성하기
                </Button>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              {reviews.length === 0 ? (
                <p>아직 작성된 리뷰가 없습니다.</p>
              ) : (
                reviews.map((review) => (
                  <Card key={review.reviewId} style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{review.memberNickname}</div>
                        <Rate disabled defaultValue={review.rating} style={{ fontSize: 16 }} />
                        <div style={{ fontSize: 12, color: '#888' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div>{weatherIcon(review.weather)}</div>
                    </div>
                    <p style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{review.content}</p>
                    {review.imageUrls && review.imageUrls.length > 0 && (
                      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        {review.imageUrls.split(',').map((url, idx) => (
                          <img
                            key={idx}
                            src={`/upload/reviews/${url.trim()}`}
                            alt={`review-${idx}`}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                            onError={(e) => {
                              e.target.src = '/image/other/tempImage.jpg';
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <div
                      style={{
                        cursor: 'pointer',
                        marginTop: 12,
                        border: '1px solid #ddd',
                        padding: '4px 8px',
                        borderRadius: 4,
                        display: 'inline-block',
                      }}
                      onClick={() => toggleLike(review.reviewId)}
                    >
                      {likeStates[review.reviewId]?.liked ? <LikeFilled /> : <LikeOutlined />}{' '}
                      도움이 돼요 ({likeStates[review.reviewId]?.count ?? 0})
                    </div>
                  </Card>
                ))
              )}
              <Pagination
                current={page + 1}
                total={totalElements}
                pageSize={size}
                onChange={(p) => setPage(p - 1)}
                style={{ marginTop: 24, textAlign: 'center' }}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReviewTripPlanDetail;
