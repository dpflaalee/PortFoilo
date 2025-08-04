import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Rate, Input, Button, message, Upload, Checkbox, Row, Col } from 'antd';
import { UploadOutlined, CheckCircleTwoTone, QuestionOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const keywordOptions = [
  '트렌디해요', '청결 상태가 좋아요', '다시 방문하고 싶어요', '뷰가 멋있어요',
  '편안해요', '가격이 합리적이에요', '반려견 친화적', '서비스가 친절해요',
  '힐링돼요', '주차하기 편해요', '조용해요', '기대보다 아쉬웠어요'
];

const getWeatherImage = (condition) => {
  switch (condition) {
    case '흐림': return 'cloudy.png';
    case '맑음': return 'sun.png';
    case '구름많음': return 'mostly-cloudy.png';
    case '비': return 'rain.png';
    case '눈': return 'snow.png';
    default: return null;
  }
};

const PlaceReviewWrite = () => {
  const router = useRouter();
  const { tripPlanId } = router.query;

  const [memberId, setMemberId] = useState(null);
  const [reservs, setReservs] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/auth/check', { withCredentials: true })
      .then(res => setMemberId(res.data.id))
      .catch(() => {
        message.error("로그인이 필요합니다.");
        router.push('/member/login');
      });
  }, []);

  useEffect(() => {
    if (!tripPlanId || !memberId) return;

    const fetchReservs = async () => {
      try {
        const res = await axios.get('/review/place-reservations', {
          params: { tripPlanId, memberId },
        });

        const rawReservs = res.data;

        // 각 예약에 대해 리뷰 여부 체크
        const filtered = await Promise.all(
          rawReservs.map(async (r) => {
            const check = await axios.get('/review/reserv/review-check', {
              params: { memberId, reservId: r.id },
            });
            return check.data === true ? r : null;
          })
        );

        const writeableReservs = filtered.filter(Boolean);
        setReservs(writeableReservs);

        const initialData = {};
        for (const r of writeableReservs) {
          initialData[r.id] = {
            rating: 0,
            content: '',
            keywords: [],
            fileList: [],
            submitted: false,
            weather: '',
          };

          // 날씨 정보 가져오기
          axios.get('/review/weather', {
            params: { type: 'PLACE', targetId: r.id },
          }).then(resp => {
            setReviews(prev => ({
              ...prev,
              [r.id]: {
                ...prev[r.id],
                weather: resp.data,
              },
            }));
          });
        }

        setReviews(initialData);
      } catch (err) {
        message.error("장소 목록을 불러오지 못했습니다.");
      }
    };

    fetchReservs();
  }, [tripPlanId, memberId]);

  const handleChange = (reservId, field, value) => {
    setReviews(prev => ({
      ...prev,
      [reservId]: {
        ...prev[reservId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (reservId) => {
    const review = reviews[reservId];
    if (!review.rating || !review.content) {
      message.warning("별점과 내용을 입력해주세요.");
      return;
    }

    const reviewDto = {
      memberId,
      reviewTypeId: 2, // PLACE
      targetId: reservId,
      rating: review.rating,
      content: review.content,
    };

    const formData = new FormData();
    formData.append('review', new Blob([JSON.stringify(reviewDto)], { type: 'application/json' }));
    review.fileList.forEach(file => {
      formData.append('images', file.originFileObj);
    });

    try {
      setLoading(true);
      await axios.post('/review/write', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setReviews(prev => ({
        ...prev,
        [reservId]: { ...prev[reservId], submitted: true },
      }));
      message.success("리뷰가 저장되었습니다.");
    } catch (err) {
      message.error("리뷰 저장 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleAIReview = async (reservId) => {
    const selected = reviews[reservId].keywords;
    if (selected.length === 0) {
      message.warning("키워드를 하나 이상 선택해주세요.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/review/generate", { keywords: selected });
      setReviews(prev => ({
        ...prev,
        [reservId]: { ...prev[reservId], content: res.data.content },
      }));
      message.success("AI 리뷰가 생성되었습니다.");
    } catch (err) {
      message.error("AI 리뷰 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = (reservId, { fileList }) => {
    handleChange(reservId, 'fileList', fileList);
  };

  const allSubmitted = Object.values(reviews).length > 0 && Object.values(reviews).every(r => r.submitted);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 50 }}>장소 리뷰</h2>

      {reservs.length === 0 || allSubmitted ? (
        //리뷰가 없거나 전부 작성된 경우 동일 UI 출력
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 32 }} />
          <h3>모든 리뷰를 작성했습니다!</h3>
          <Button type="primary" onClick={() => router.push('/')}>홈으로 이동</Button>
        </div>
      ) : (
        reservs.map((reserv) => {
          console.log('reservs:', reservs);
          const review = reviews[reserv.id];
          if (!review || review.submitted) return null;

          return (
            <div key={reserv.id} style={{ marginBottom: 32, borderBottom: '1px solid #ddd', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                {/* 좌측: 장소 이미지 + 이름 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {reserv.place?.imageUrl && (
                    <img
                      src={reserv.place.imageUrl.startsWith('http') ? reserv.place.imageUrl : reserv.place.imageUrl}
                      alt={reserv.place.name || '장소 이미지'}
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 12 }}
                    />
                  )}
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                      {reserv.place?.name || '장소 이름 없음'}
                    </div>
                  </div>
                </div>

                {/* 우측: 날씨 아이콘 */}
                <div style={{ marginLeft: 'auto', width: 60, textAlign: 'right' }}>
                  {['맑음', '흐림', '비', '눈', '구름많음'].includes(review.weather) ? (
                    <img
                      src={`/image/weather/${getWeatherImage(review.weather)}`}
                      alt={review.weather}
                      style={{ width: 40, height: 40 }}
                    />
                  ) : (
                    <QuestionOutlined style={{ fontSize: 24, color: '#ccc' }} />
                  )}
                </div>
              </div>
              <Rate value={review.rating} onChange={(v) => handleChange(reserv.id, 'rating', v)} />
              <Checkbox.Group value={review.keywords} onChange={(v) => handleChange(reserv.id, 'keywords', v)}>
                <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
                  {keywordOptions.map((keyword) => (
                    <Col key={keyword}><Checkbox value={keyword}>{keyword}</Checkbox></Col>
                  ))}
                </Row>
              </Checkbox.Group>
              <Button onClick={() => handleAIReview(reserv.id)} style={{ marginTop: 10 }}>AI 리뷰 생성</Button>
              <TextArea
                rows={4}
                value={review.content}
                onChange={(e) => handleChange(reserv.id, 'content', e.target.value)}
                placeholder="리뷰를 작성해주세요"
                style={{ marginTop: 10 }}
              />
              <Upload
                multiple
                fileList={review.fileList}
                onChange={(info) => handleUploadChange(reserv.id, info)}
                beforeUpload={() => false}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>사진 첨부하기</Button>
              </Upload>
              <Button type="primary" onClick={() => handleSubmit(reserv.id)} loading={loading} style={{ marginTop: 10 }}>
                저장
              </Button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PlaceReviewWrite;
