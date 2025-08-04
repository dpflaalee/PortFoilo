// pages/mypage/checklist/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MypageLayout from '@/components/layout/MyPageLayout';
import ChecklistTemplateList from '@/components/checklist/ChecklistTemplateList';
import ChecklistItemManager from '@/components/checklist/ChecklistItemManager';
import { Divider } from 'antd';
import axios from 'axios';

const ChecklistPage = () => {
  const [user, setUser] = useState(null); // 유저 상태
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부
  const router = useRouter();

  const checkUser = async () => {
    try {
      const response = await axios.get('/api/auth/check', { withCredentials: true });

      if (response.status === 200) {
        const data = response.data;

        if (data.auth !== 'ADMIN') {
          router.push('/mypage');
          return;
        }

        setUser(data);
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('사용자 정보 확인 실패:', error);
      router.push('/login');
    }
  };
  useEffect(() => {
    checkUser();
  }, []);
  if (!isAdmin) return <div>관리자 전용 페이지입니다.</div>;

  return (
    <MypageLayout>
      <ChecklistTemplateList />
      <Divider />
      <ChecklistItemManager />
    </MypageLayout>
  );
};

export default ChecklistPage;
