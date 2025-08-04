import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Popover, message, Modal, Select, Avatar } from 'antd';
import { EllipsisOutlined, LeftOutlined, UserOutlined, PictureOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { REMOVE_ANIPROFILE_REQUEST, ANIFOLLOW_REQUEST, ANIUNFOLLOW_REQUEST } from '@/reducers/animal';

const AnimalProfileCard = ({ ownerId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedMyAnimalId, setSelectedMyAnimalId] = useState(null);

  const { selectedAnimal, myAnimals } = useSelector((state) => state.animal);
  const { user } = useSelector((state) => state.user);
  const isOwner = user && Number(user.id) === Number(ownerId);

  const imageBaseUrl = 'http://localhost:3065/uploads/animalProfile';

  if (!selectedAnimal) return null;

  const {
    id,
    aniName,
    aniAge,
    aniProfile,
    Followings,
    Followers,
    Category,
    UserId,
  } = selectedAnimal;

  const onClickModify = () => {
    router.push(`/animal/${id}/edit`);
  };

  const handleClick = () => {
    router.push(`/user/myPage/${UserId}`);
  };

  const onClickDelete = () => {
    if (window.confirm(`${aniName} 프로필을 정말 삭제하시겠습니까?`)) {
      dispatch({ type: REMOVE_ANIPROFILE_REQUEST, data: id });
      message.success('프로필 삭제 요청을 보냈습니다.');
      router.push(`/user/myPage/${user.id}`);
    }
  };

  const showSelectModal = (type) => {
    setActionType(type); // 'follow' or 'unfollow'
    setIsModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedMyAnimalId) return;

    dispatch({
      type: actionType === 'follow' ? ANIFOLLOW_REQUEST : ANIUNFOLLOW_REQUEST,
      data: {
        myAnimalId: selectedMyAnimalId,
        targetAnimalId: selectedAnimal.id,
      },
    });
    setIsModalOpen(false);
    setSelectedMyAnimalId(null);
  };

  return (
    <div style={{ width: '100%', borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff', position: 'relative' }}>
      <LeftOutlined
        onClick={handleClick}
        style={{
          fontSize: 20,
          cursor: 'pointer',
          position: 'absolute',
          top: 12,
          left: 16,
          zIndex: 2,
          color: '#fff',
        }}
      />
      <div
        style={{
          // backgroundColor: '#f8dada',
          padding: '32px 20px 16px 48px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#ccc',
            overflow: 'hidden',
            marginRight: 16,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {aniProfile ? (
            <img
              src={`${imageBaseUrl}/${aniProfile}`}
              alt="프로필 사진"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <PictureOutlined style={{ fontSize: 36, color: 'white'}} />
          )}
        </div>
        <div style={{ flexGrow: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>{aniName}</div>
          {Category?.content && (
            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
              {Category.content}
            </div>
          )}
          <div style={{ fontSize: 14, marginTop: 6, color: '#555' }}>
            {aniAge}살 &nbsp;&nbsp;&nbsp;
            {Followings?.length ?? 0} 팔로잉 &nbsp;&nbsp;&nbsp;
            {Followers?.length ?? 0} 팔로워
          </div>
        </div>
      </div>

      {isOwner && (
        <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button size="small" onClick={onClickModify}>정보 수정</Button>
          <Button size="small" danger onClick={onClickDelete}>프로필 삭제</Button>
          {/*<Popover content={popoverContent} trigger="click">
            <EllipsisOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Popover>
          <AnimalSearch visible={isModalOpen} onClose={() => setIsModalOpen(false)} />*/}
        </div>
      )}

      {!isOwner && (
        <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button type="primary" onClick={() => showSelectModal('follow')}>친구 맺기</Button>
          <Button danger onClick={() => showSelectModal('unfollow')}>친구 끊기</Button>
        </div>
      )}

      <Modal
        title={actionType === 'follow' ? '친구 맺을 내 동물 선택' : '친구 끊을 내 동물 선택'}
        open={isModalOpen}
        onOk={handleConfirmAction}
        onCancel={() => setIsModalOpen(false)}
        okText={actionType === 'follow' ? '친구 맺기' : '친구 끊기'}
        cancelText="취소"
      >
        {myAnimals.length > 0 ? (
          <Select
            style={{ width: '100%' }}
            placeholder="내 동물 선택"
            onChange={(value) => setSelectedMyAnimalId(value)}
            value={selectedMyAnimalId}
            dropdownRender={menu => (
              <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                {menu}
              </div>
            )}
          >
            {myAnimals.map((ani) => (
              <Select.Option key={ani.id} value={ani.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar
                    size="small"
                    src={ani.aniProfile ? `${imageBaseUrl}/${ani.aniProfile}` : null}
                    icon={!ani.aniProfile && <UserOutlined />}
                  />
                  <span>{ani.aniName}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        ) : (
          <div style={{ textAlign: 'center', color: '#999' }}>등록된 내 동물이 없습니다.</div>
        )}
      </Modal>
    </div>
  );
};

export default AnimalProfileCard;
