import React from 'react';
import { Tabs, Rate, Avatar, Button } from 'antd';
import { EnvironmentOutlined, SunOutlined, CloudOutlined, ThunderboltOutlined } from '@ant-design/icons';


const { TabPane } = Tabs;

const dummyPlace = {
  name: '함께할개사랑할개',
  category: '애견카페 (장소 분류 ex.카페 숙소 공원 등)',
  avgRating: 4.0,
  reviewCount: 3,
};

const dummyReviews = [
  {
    id: 1,
    nickname: '사용자 닉네임',
    rating: 4,
    timeAgo: '1시간 전',
    content:
      '반려견 동이와 함께 처음으로 1박 2일 여행을 다녀왔어요. 숙소에 들어서자마자 반려견을 위한 전용 침대와 식기, 어메니티까지 준비돼 있어 감동했고...',
  },
  {
    id: 2,
    nickname: '사용자 닉네임',
    rating: 3,
    timeAgo: '1시간 전',
    content: '반려견과 걷기 좋은데 하필 비가ㅠㅠ',
  },
];

const PlaceReviewPage = () => {
  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 24 }}>
      {/* 헤더: 장소명 + 평점 */}
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>{dummyPlace.name}</h2>
      <div style={{ color: '#888', marginBottom: 8 }}>{dummyPlace.category}</div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Rate value={dummyPlace.avgRating} disabled />
        <span style={{ marginLeft: 8 }}>{dummyPlace.avgRating.toFixed(1)}</span>
        <span style={{ marginLeft: 12, color: '#888' }}>리뷰 {dummyPlace.reviewCount}</span>
      </div>

      {/* 메인: 지도 + 오른쪽 정보 */}
      <div style={{ display: 'flex', gap: 24 }}>
        {/* 지도 자리 */}
        <div style={{ flex: 1, height: 500, backgroundColor: '#eee' }}>
          <div style={{ textAlign: 'center', paddingTop: 200, color: '#888' }}>
            <EnvironmentOutlined style={{ fontSize: 48 }} />
            <div>지도 표시 영역</div>
          </div>
        </div>

        {/* 오른쪽 정보 패널 */}
        <div style={{ flex: 1.1 }}>
          {/* 대표 이미지 */}
          <div
            style={{
              width: '100%',
              height: 160,
              backgroundColor: '#ddd',
              borderRadius: 8,
              marginBottom: 16,
            }}
          />

          {/* 탭: 홈 / 리뷰 */}
          <Tabs defaultActiveKey="review">
            <TabPane tab="홈" key="home">
              <p>홈 정보 (위치, 소개 등)</p>
            </TabPane>
            <TabPane tab="리뷰" key="review">
              {dummyReviews.map((r) => (
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
                        <div style={{ fontWeight: 600 }}>{r.nickname}</div>
                        <Rate value={r.rating} disabled style={{ fontSize: 14, margin: '4px 0' }} />
                        <div style={{ fontSize: 12, color: '#888' }}>{r.timeAgo}</div>
                      </div>
                    </div>

                    {/* 날씨 아이콘 */}
                    <div style={{ fontSize: 24, color: '#1890ff' }}>
                      {/* 예: 흐림일 때 */}
                      <SunOutlined />
                      {/* 또는 맑음이라면: <SunOutlined /> */}
                      {/* 또는 비라면: <CloudRainOutlined /> */}
                    </div>
                  </div>
                  <Button block style={{ marginTop: 12 }}>
                    👍 도움이 돼요.
                  </Button>
                </div>
              ))}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PlaceReviewPage;
