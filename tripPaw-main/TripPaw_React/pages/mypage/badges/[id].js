import React from 'react';
import { useRouter } from 'next/router';
import MyPageLayout from '@/components/layout/MyPageLayout';
import Sidebar from '@/components/mypage/Sidebar';
import MyBadgeSection from '@/components/review/MyBadgeSection';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const MyBadgePage = () => {
  const router = useRouter();
  const { id } = router.query;

  // 라우터 준비되기 전엔 null
  if (!router.isReady) return null;

  return (
    <MyPageLayout>
      <div style={{ display: 'flex', minHeight: '100vh' ,overflow: 'hidden' }}>
        <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            padding: '24px',
            background: '#f9f9f9', 
            }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ margin: 0 }}>내 뱃지 목록</h2>
            <Tooltip title="작성하신 리뷰의 글자 수에 따라서 뱃지가 지급 됩니다.">
              <InfoCircleOutlined style={{ fontSize: 18, color: '#888' }} />
            </Tooltip>
          </div>
          <MyBadgeSection memberId={id} />
        </div>
      </div>
    </MyPageLayout>
  );
};

export default MyBadgePage;