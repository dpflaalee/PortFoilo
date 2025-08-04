import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Tabs, Rate, Avatar, Button, Spin } from 'antd';
import {
  EnvironmentOutlined,
  SunOutlined,
  // CloudOutlined,
  // ThunderboltOutlined,
  QuestionOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;

const PlaceReviewPage = () => {
  const router = useRouter();
  const { id: placeId } = router.query;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [likeStates, setLikeStates] = useState({});
  const memberId = 1; // 로그인 사용자 ID 대체 필요

  useEffect(() => {
    if (!placeId) return;
    fetchReviewsByPlace();
  }, [placeId]);

  const fetchReviewsByPlace = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/review/place/${placeId}`);
      setReviews(res.data);

      // 평균 평점 계산
      if (res.data.length > 0) {
        const avg = res.data.reduce((sum, r) => sum + r.rating, 0) / res.data.length;
        setAvgRating(Number(avg.toFixed(1)));
        setReviewCount(res.data.length);
      }

      // 좋아요 상태 및 카운트 불러오기
      const newLikeStates = {};
      for (let review of res.data) {
        const [likedRes, countRes] = await Promise.all([
          axios.get(`/review/${review.id}/like/marked`, {
            params: { memberId },
          }),
          axios.get(`/review/${review.id}/like/count`),
        ]);
        newLikeStates[review.id] = {
          liked: likedRes.data,
          count: countRes.data,
        };
      }
      setLikeStates(newLikeStates);
    } catch (err) {
    }
    setLoading(false);
  };

  const toggleLike = async (reviewId) => {
    const current = likeStates[reviewId];
    try {
      if (current?.liked) {
        await axios.delete(`/review/${reviewId}/like`, {
          params: { memberId },
        });
      } else {
        await axios.post(`/review/${reviewId}/like`, null, {
          params: { memberId },
        });
      }

      const [likedRes, countRes] = await Promise.all([
        axios.get(`/review/${reviewId}/like/marked`, {
          params: { memberId },
        }),
        axios.get(`/review/${reviewId}/like/count`),
      ]);

      setLikeStates({
        ...likeStates,
        [reviewId]: {
          liked: likedRes.data,
          count: countRes.data,
        },
      });
    } catch (err) {
    }
  };

  const getWeatherImageFileName = (condition) => {
    switch (condition) {
      case '흐림':
        return 'cloudy.png';
      case '비':
        return 'rain.png';
      case '눈':
        return 'snow.png';
      case '구름많음':
        return 'mostly-cloudy.png';
    }
  };


  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>
        {router.query.name || '장소명'} {/* 또는 이전 페이지에서 전달한 값 */}
      </h2>
      <div style={{ color: '#888', marginBottom: 8 }}>
        {router.query.category || '장소 카테고리'}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Rate value={avgRating} disabled />
        <span style={{ marginLeft: 8 }}>{avgRating}</span>
        <span style={{ marginLeft: 12, color: '#888' }}>리뷰 {reviewCount}개</span>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1, height: 500, backgroundColor: '#eee' }}>
          <div style={{ textAlign: 'center', paddingTop: 200, color: '#888' }}>
            <EnvironmentOutlined style={{ fontSize: 48 }} />
            <div>지도 표시 영역</div>
          </div>
        </div>

        <div style={{ flex: 1.1 }}>
          <div
            style={{
              width: '100%',
              height: 160,
              backgroundColor: '#ddd',
              borderRadius: 8,
              marginBottom: 16,
            }}
          />

          <Tabs defaultActiveKey="review">
            <TabPane tab="홈" key="home">
              <p>홈 정보 (위치, 소개 등)</p>
            </TabPane>
            <TabPane tab="리뷰" key="review">
              {loading ? (
                <Spin tip="리뷰 불러오는 중..." />
              ) : (
                reviews.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      borderBottom: '1px solid #eee',
                      paddingBottom: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar size={48} />
                        <div style={{ marginLeft: 12 }}>
                          <div style={{ fontWeight: 600 }}>{r.member.nickname}</div>
                          <Rate value={r.rating} disabled style={{ fontSize: 14, margin: '4px 0' }} />
                          <div style={{ fontSize: 12, color: '#888' }}>{r.createdAt?.substring(0, 10)}</div>
                        </div>
                      </div>

                      <div style={{ fontSize: 24, color: '#1890ff' }}>
                        {r.weatherCondition === '맑음' && <SunOutlined style={{ color: 'orange' }} />}
                        {r.weatherCondition === '흐림' &&
                          (<img
                            src={`/image/weather/${getWeatherImageFileName(r.weatherCondition)}`}
                            alt={r.weatherCondition}
                            style={{ width: 50, height: 50 }}
                          />
                          )}
                        {r.weatherCondition === '비' &&
                          (<img
                            src={`/image/weather/${getWeatherImageFileName(r.weatherCondition)}`}
                            alt={r.weatherCondition}
                            style={{ width: 50, height: 50 }}
                          />
                          )}
                        {r.weatherCondition === '눈' &&
                          (<img
                            src={`/image/weather/${getWeatherImageFileName(r.weatherCondition)}`}
                            alt={r.weatherCondition}
                            style={{ width: 50, height: 50 }}
                          />
                          )}
                        {r.weatherCondition === '구름많음' &&
                          (<img
                            src={`/image/weather/${getWeatherImageFileName(r.weatherCondition)}`}
                            alt={r.weatherCondition}
                            style={{ width: 50, height: 50 }}
                          />
                          )}
                        {r.weatherCondition === '알 수 없음' && <QuestionOutlined style={{ color: '#aaa' }} />}
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>{r.content}</div>
                    <Button
                      block
                      type={likeStates[r.id]?.liked ? 'primary' : 'default'}
                      onClick={() => toggleLike(r.id)}
                      style={{ marginTop: 12 }}
                    >
                      👍 도움이 돼요 {likeStates[r.id]?.count ?? 0}
                    </Button>
                  </div>
                ))
              )}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PlaceReviewPage;
