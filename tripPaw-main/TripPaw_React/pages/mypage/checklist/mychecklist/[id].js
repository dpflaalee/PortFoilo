import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Divider, message } from 'antd';
import axios from 'axios';

import MypageLayout from '@/components/layout/MyPageLayout';
import UserChecklistRoutineList from '@/components/checkUser/UserChecklistRoutineList';

const MyChecklistPage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { id: memberId } = router.query;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/check', { withCredentials: true });
        if (res.status === 200) {
          const authUser = res.data;
          setUser(authUser);

          if (`${authUser.id}` !== memberId) {
            message.warning('본인만 접근할 수 있습니다.');
            router.push('/mypage');
          }
        }
      } catch (err) {
        message.error('로그인이 필요합니다.');
        router.push('/member/login');
      }
    };

    if (memberId) checkAuth();
  }, [memberId]);

  if (!user || `${user.id}` !== memberId) return <div>접근 권한이 없습니다.</div>;

  return (
    <MypageLayout>
      <UserChecklistRoutineList memberId={memberId} />
      <Divider />
    </MypageLayout>
  );
};

export default MyChecklistPage;
