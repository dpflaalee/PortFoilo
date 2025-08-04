import React, { useState } from 'react';
import { Rate, Checkbox, Input, Upload, Button, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

const keywordOptions = [
  '트렌디해요', '청결 상태가 좋아요', '다시 방문하고 싶어요', '뷰가 멋있어요',
  '편안해요', '가격이 합리적이에요', '반려견 친화적', '서비스가 친절해요',
  '힐링돼요', '주차하기 편해요', '조용해요', '기대보다 아쉬웠어요'
];

const ReviewForm = ({ planId }) => {
  const [rating, setRating] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [content, setContent] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const handleAIReview = async () => {
    try {
      const res = await axios.post('/api/reviews/generate', {
        keywords,
        planId,
      });
      setContent(res.data.content);
    } catch (err) {
      message.error('AI 리뷰 생성 실패');
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('rating', rating.toString());
    formData.append('keywords', keywords.join(','));
    formData.append('content', content);
    formData.append('planId', planId);

    fileList.forEach(file => {
      formData.append('images', file.originFileObj);
    });

    try {
      await axios.post('/api/reviews', formData);
      message.success('리뷰가 성공적으로 저장되었습니다!');
    } catch (err) {
      message.error('리뷰 저장 실패');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h2>이 장소에서의 경험은 어떠셨나요?</h2>
      <Rate value={rating} onChange={setRating} style={{ fontSize: 24 }} />

      <h3 style={{ marginTop: 30 }}>이 여행에 어울리는 키워드를 골라주세요.</h3>
      <Checkbox.Group
        options={keywordOptions}
        value={keywords}
        onChange={checked => setKeywords(checked)}
      >
        <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
          {keywordOptions.map(keyword => (
            <Col key={keyword}>
              <Checkbox value={keyword} style={{ fontSize: 14 }}>
                {keyword}
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>

      <TextArea
        rows={6}
        placeholder="리뷰를 작성해주세요"
        value={content}
        onChange={e => setContent(e.target.value)}
        style={{ marginTop: 20 }}
      />

      <Button
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
          <Button 
            style={{
              backgroundColor: '#fff',
              color: '#000',
              border: '1px solid #000',
            }}
          >
            취소
          </Button>
        </Col>
        <Col>
          <Button type="primary" 
            style={{
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
            }}
            size="large" onClick={handleSubmit} 
          >
            다음으로 넘어가기
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ReviewForm;
