import React from 'react';
import { Button, Tabs, Avatar, List } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router';
import AniProfile from '@/pages/animal/AniProfile';
import { PlusOutlined, PictureOutlined } from '@ant-design/icons';

const AnimalList = ({ animals, ownerId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const imageBaseUrl = 'http://localhost:3065/uploads/animalProfile';

  const handleClick = (id) => {
    router.push(`/animal/${id}`);
  };

  const handleRegisterAnimal = () => {
    router.push('/animal/ani-profile-form'); 
  };

  const isOwner = user && user.id != null && Number(user.id) === Number(ownerId);

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '16px 110px 16px 16px', 
          backgroundColor: '#ffeccc',
          // borderRadius: 8,
          minHeight: 100,
        }}
      >
        {animals?.map((ani) => (
          <div
            key={ani.id}
            style={{ textAlign: 'center', cursor: 'pointer', marginRight: 20 }}
            onClick={() => handleClick(ani.id)}
          >
            <Avatar
              size={64}
              src={ani.aniProfile ? `${imageBaseUrl}/${ani.aniProfile}` : undefined}
              icon={!ani.aniProfile && <PictureOutlined />}
              style={{ backgroundColor: '#ddd', marginBottom: 8 }}
            />
            <div style={{ fontSize: 14, color: '#333' }}>{ani.aniName}</div>
          </div>
        ))}
      </div>

      {isOwner && (
        <div style={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', zIndex: 10 }}>
          <div
            onClick={handleRegisterAnimal}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 110,
              height: 54,
              padding: '8px 8px',
              border: '1px solid #895200',
              borderRadius: 8,
              color: '#895200',
              fontWeight: 600,
              //lineHeight: '18px',
              background: 'white',
              cursor: 'pointer',
              whiteSpace: 'pre-line',
            }}
          >
            <span>반려동물<br />프로필 등록</span>
            <PlusOutlined />
          </div>
        </div>
      )}
    </div>
  );
};
export default AnimalList;
