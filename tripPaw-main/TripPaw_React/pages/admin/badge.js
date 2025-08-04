import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BadgeList from '@/components/badge/BadgeList';
import BadgeForm from '@/components/badge/BadgeForm';
import BadgeEditForm from '@/components/badge/BadgeEditForm';
import { Button, Spin, message } from 'antd';
import MypageLayout from '@/components/layout/MyPageLayout';
import { useRouter } from 'next/router';

const AdminBadgePage = () => {
  const [badges, setBadges] = useState([]);
  const [editingBadge, setEditingBadge] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  const fetchBadges = async () => {
    try {
      const res = await axios.get('/admin/badge');
      setBadges(res.data);
    } catch (err) {
      console.error('뱃지 목록 조회 실패', err);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get('/api/auth/check', { withCredentials: true });
        const isAdmin = res.data.id === 1 || res.data.role === 'ADMIN';
        if (isAdmin) {
          setAuthorized(true);
          fetchBadges();
        } else {
          message.error('관리자만 접근 가능한 페이지입니다.');
          router.replace('/');
        }

      } catch (err) {
        console.error('인증 확인 실패', err);
        message.error('로그인이 필요합니다.');
        router.replace('/member/login'); // 로그인 페이지로 이동
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <MypageLayout>
        <div style={{ textAlign: 'center', marginTop: 100 }}>
          <Spin size="large" tip="접근 권한 확인 중..." />
        </div>
      </MypageLayout>
    );
  }

  if (!authorized) return null; // 권한 없으면 아무것도 렌더링 안 함

  return (
    <MypageLayout>
      <div style={{ padding: 32 }}>
        <h2>뱃지 목록</h2>
        <Button type="primary" onClick={() => setShowForm(true)} style={{ marginBottom: 24 }}>
          뱃지 추가
        </Button>

        {showForm && (
          <BadgeForm
            onCancel={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchBadges();
            }}
          />
        )}

        {editingBadge && (
          <BadgeEditForm
            badgeData={editingBadge}
            onCancel={() => setEditingBadge(null)}
            onSuccess={() => {
              setEditingBadge(null);
              fetchBadges();
            }}
          />
        )}

        {!showForm && !editingBadge && (
          <BadgeList
            badges={badges}
            onEdit={(badge) => setEditingBadge(badge)}
            onDeleteSuccess={fetchBadges}
          />
        )}
      </div>
    </MypageLayout>
  );
};

export default AdminBadgePage;
