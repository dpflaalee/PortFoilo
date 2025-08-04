import React from 'react';
import { useRouter } from 'next/router';
import MyPageLayout from '@/components/layout/MyPageLayout';
import Sidebar from '@/components/mypage/Sidebar';
import MyReviewList from '@/components/review/MyReviewList';

const MyReviewPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // 라우터 준비되기 전엔 null
  if (!router.isReady) return null;

  return (
    <MyPageLayout>
      <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          //background: '#f9f9f9',
        }}>
          <h2>내 리뷰 목록</h2>
          <MyReviewList memberId={id} />
        </div>
      </div>
    </MyPageLayout>

  );
};

export default MyReviewPage;