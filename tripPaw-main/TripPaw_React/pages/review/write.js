import React, { useEffect, useState } from 'react';
import { Rate, Checkbox, Input, Upload, Button, Row, Col, message } from 'antd';
import { UploadOutlined, QuestionOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';

const { TextArea } = Input;

const keywordOptions = [
  '트렌디해요', '청결 상태가 좋아요', '다시 방문하고 싶어요', '뷰가 멋있어요',
  '편안해요', '가격이 합리적이에요', '반려견 친화적', '서비스가 친절해요',
  '힐링돼요', '주차하기 편해요', '조용해요', '기대보다 아쉬웠어요'
];

const ReviewForm = () => {
  const router = useRouter();
  const { isReady, query } = router;
  const { tripPlanId, reservId, title, startDate, endDate, placeImage, placeName } = query;
  const [reviewTypeId, setReviewTypeId] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [rating, setRating] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [content, setContent] = useState('');
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState('');
  const [days, setDays] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/auth/check', {
          withCredentials: true,
        });
        setMemberId(response.data.id);
      } catch (err) {
        router.push('/member/login');
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const { tripPlanId, reservId, reviewTypeId, targetId } = query;

    if (tripPlanId) {
      setReviewTypeId(1);
      setTargetId(Number(tripPlanId));
    } else if (reservId) {
      setReviewTypeId(2);
      setTargetId(Number(reservId));
    } else if (reviewTypeId && targetId) {
      setReviewTypeId(Number(reviewTypeId));
      setTargetId(Number(targetId));
    }
  }, [isReady, query]);


  useEffect(() => {
    if (!isReady || !reviewTypeId || !targetId) return;
    const type = reviewTypeId === 1 ? 'PLAN' : 'PLACE';

    axios.get('/review/weather', {
      params: { type, targetId },
    })
      .then((res) => setWeather(res.data))
      .catch((err) => {
        setWeather('알 수 없음');
      });
  }, [isReady, reviewTypeId, targetId]);

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const handleAIReview = async () => {
    if (keywords.length === 0) {
      message.warning("키워드를 하나 이상 선택해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/review/generate", { keywords });
      setContent(res.data.content);
      message.success("AI 리뷰가 생성되었습니다.");
    } catch (err) {
      message.error("AI 리뷰 생성 실패");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (reviewTypeId === 1 && targetId) {
      axios.get(`/tripPlan/${targetId}`)
        .then((res) => {
          setDays(res.data.days);  // days 값 가져오기
        })
        .catch((err) => {
        });
    }
  }, [reviewTypeId, targetId]);


  const handleSubmit = async () => {
    console.log('memberId:', memberId);
    console.log('reviewTypeId:', reviewTypeId);
    console.log('targetId:', targetId);
    if (!targetId || !reviewTypeId || !memberId) {
      message.error('리뷰 작성에 필요한 정보가 부족합니다.');
      return;
    }

    const formData = new FormData();
    const reviewDto = {
      memberId,
      reviewTypeId,
      targetId,
      content,
      rating,
      reservId
    };

    formData.append('review', JSON.stringify(reviewDto));
    fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });

    try {
      await axios.post('/review/write', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      message.success('리뷰가 저장되었습니다!');
      router.push('/mypage');
    } catch (err) {
    }
  };

  const getWeatherImage = (condition) => {
    switch (condition) {
      case '흐림': return 'cloudy.png';
      case '맑음': return 'sun.png';
      case '구름많음': return 'mostly-cloudy.png';
      case '비': return 'rain.png';
      case '눈': return 'snow.png';
    }
  };

  const handleNextWithSave = async () => {
    if (!memberId || !targetId || !reviewTypeId) {
      message.error('필수 정보 누락');
      return;
    }

    if (!rating || !content) {
      message.warning('별점과 내용을 입력해주세요.');
      return;
    }

    const reviewDto = {
      memberId,
      reviewTypeId: Number(reviewTypeId), // 1
      targetId: Number(targetId),         // tripPlanId
      rating,
      content,
    };

    //formData 정의 추가
    const formData = new FormData();
    formData.append('review', JSON.stringify(reviewDto));
    fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });

    try {
      await axios.post('/review/write', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      message.success('경로 리뷰가 저장되었습니다.');
      router.push({
        pathname: '/review/place/write',
        query: { tripPlanId: targetId, memberId },
      });
    } catch (err) {
    }
  };

  if (!isReady) return <div>로딩 중...</div>;

  ////
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {reviewTypeId === 2 && placeImage && (
            <img
              src={placeImage.startsWith("http") ? placeImage : placeImage}
              alt="장소 이미지"
              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 12 }}
            />
          )}
          <div>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>{placeName || title}</div>
            {reviewTypeId === 1 && (
              <div style={{ fontSize: 14, color: '#777' }}>
                일정 | {days ? `${days}일 플랜` : '일정 정보 없음'}
              </div>
            )}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', width: 60, textAlign: 'right' }}>
          {['맑음', '흐림', '비', '눈', '구름많음'].includes(weather) ? (
            <img src={`/image/weather/${getWeatherImage(weather)}`} alt={weather} style={{ width: 40, height: 40 }} />
          ) : (
            <QuestionOutlined style={{ fontSize: 24, color: '#ccc' }} />
          )}
        </div>
      </div>

      <h4>이 장소에서의 경험은 어떠셨나요?</h4>
      <Rate value={rating} onChange={setRating} style={{ fontSize: 24 }} />

      <h4 style={{ marginTop: 30 }}>이 여행에 어울리는 키워드를 골라주세요.</h4>
      <Checkbox.Group value={keywords} onChange={setKeywords}>
        <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
          {keywordOptions.map((keyword) => (
            <Col key={keyword}>
              <Checkbox value={keyword} style={{ fontSize: 14 }}>{keyword}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>

      <TextArea
        rows={6}
        placeholder="리뷰를 작성해주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ marginTop: 20 }}
      />

      <Button
        loading={loading}
        onClick={handleAIReview}
        block
        style={{ marginTop: 10, backgroundColor: '#000', color: '#fff' }}
      >
        AI 리뷰 작성
      </Button>

      <div style={{ marginTop: 24 }}>
        <Upload
          multiple
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>사진 첨부하기</Button>
        </Upload>
      </div>

      <Row justify="space-between" style={{ marginTop: 40 }}>
        <Col>
          <Button onClick={() => router.back()} style={{ backgroundColor: '#fff', color: '#000', border: '1px solid #000' }}>
            취소
          </Button>
        </Col>
        <Col>
          <Button
            style={{ marginRight: 10, backgroundColor: '#000', color: '#fff', border: 'none' }}
            onClick={handleSubmit}
          >
            저장하기
          </Button>
          {reviewTypeId === 1 && (
            <Button
              type="primary"
              style={{ backgroundColor: '#1890ff', border: 'none' }}
              onClick={handleNextWithSave}
            >
              다음으로 넘어가기
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ReviewForm;
