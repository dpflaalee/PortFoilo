import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { List, Avatar } from "antd";
import { HeartFilled, RetweetOutlined, MessageOutlined, UserAddOutlined, NotificationOutlined, GiftOutlined, TeamOutlined, CrownFilled, CloseOutlined } from '@ant-design/icons';
import NOTIFICATION_TYPE from '../../../shared/constants/NOTIFICATION_TYPE';

const IconWrapper = styled.div`
  font-size: 20px;
  margin-right: 12px;
  color: ${props => props.color || '#666'};
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const Description = styled.div`
  color: #999;
  font-size: 14px;
`;

const Container = styled.div`
  display: flex;
  padding: 16px;
  background: ${(props) => (props.isRead ? '#fff' : '#e6f7ff')}; // 읽지 않은 알림은 파란 배경
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
  &:hover {
    background: #f0f0f0;
  }
`;

const DeleteButton = styled.button`
  border: none;
  background: transparent;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    color: #ff4d4f;
  }
`;
const Notification = ({ noti, onDelete }) => {
  const router = useRouter(); // 라우터 훅 사용

  const handleClick = () => {
    const { type, targetId, SenderId, ReceiverId } = noti;

    switch (type) {
      case NOTIFICATION_TYPE.LIKE:
      case NOTIFICATION_TYPE.RETWEET:
      case NOTIFICATION_TYPE.ADMIN_NOTI:
        router.push(`/post/${targetId}`);
        break;
      case NOTIFICATION_TYPE.COMMENT:
      case NOTIFICATION_TYPE.RECOMMENT:
        const PostId = noti.targetObject?.Post?.id;
        const commentId = noti.targetObject?.id;
        router.push(`/post/${PostId}?commentId=${targetId}`).then(() => {
          setTimeout(() => {
            const el = document.getElementById(`comment-${commentId}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });

              // 색 강조
              el.style.transition = 'background 0.8s ease';
              el.style.background = '#fff1b8';

              // 2초 후 다시 원래대로
              setTimeout(() => {
                el.style.background = '';
              }, 2000);
            }
          }, 500);
        });
        break;
      case NOTIFICATION_TYPE.FOLLOW:
        router.push(`/user/myPage/${SenderId}`);
        break;
      case NOTIFICATION_TYPE.GROUPAPPLY:
      case NOTIFICATION_TYPE.GROUPAPPLY_APPROVE:
      case NOTIFICATION_TYPE.GROUPAPPLY_REJECT:
        router.push(`/groups/${targetId}`);
        break;
      case NOTIFICATION_TYPE.ANIMAL_FRIENDS:
        router.push(`/animal/${targetId}`);
        break;
      case NOTIFICATION_TYPE.RANDOMBOX:
        router.push(`/user/myPage/${ReceiverId}`);
        break;
      default:
        alert('링크가 없는 알림입니다.');
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPE.LIKE:
        return <HeartFilled style={{ color: 'hotpink' }} />;
      case NOTIFICATION_TYPE.RETWEET:
        return <RetweetOutlined />;
      case NOTIFICATION_TYPE.COMMENT:
        return <MessageOutlined />;
      case NOTIFICATION_TYPE.FOLLOW:
        return <UserAddOutlined />;
      case NOTIFICATION_TYPE.RECOMMENT:
        return <MessageOutlined style={{ color: '#0066CC' }} />;
      case NOTIFICATION_TYPE.RANDOMBOX:
        return <GiftOutlined style={{ color: '#FF9E00' }} />;
      case NOTIFICATION_TYPE.GROUPAPPLY:
        return <TeamOutlined style={{ color: '#28a745' }} />;
      case NOTIFICATION_TYPE.GROUPAPPLY_APPROVE:
        return <TeamOutlined style={{ color: '#28a745' }} />;
      case NOTIFICATION_TYPE.GROUPAPPLY_REJECT:
        return <TeamOutlined style={{ color: '#28a745' }} />;
      case NOTIFICATION_TYPE.ADMIN_NOTI:
        return <NotificationOutlined style={{ color: '#ffcc00' }} />;
      case NOTIFICATION_TYPE.ANIMAL_FRIENDS:
        return <CrownFilled style={{ color: '#ff1493' }} />;
      default:
        return null;
    }
  };

  // 알림 유형에 맞는 텍스트 내용 렌더링
  const renderContent = (noti) => {
    console.log('🐱‍🏍 noti', noti);
    const sender = noti?.Sender || 'Dan';
    const receiver = noti?.Receiver || 'Dan';
    const notiType = noti?.type;
    const target = noti?.targetObject;

    switch (notiType) {
      case NOTIFICATION_TYPE.LIKE:
        return `${sender.nickname}님이 당신의 게시물을 좋아요했습니다.`;
      case NOTIFICATION_TYPE.RETWEET:
        return [
          `${sender.nickname}님이 당신의 게시물을 리트윗했습니다.`,
          <br key="br" />,
          `: ${target?.Retweet?.content}`
        ];
      case NOTIFICATION_TYPE.COMMENT:
        return [
          `${sender.nickname}님이 당신의 게시물에 댓글을 남겼습니다.`,
          <br key="br" />,
          `: ${target?.content}`
        ];
      case NOTIFICATION_TYPE.FOLLOW:
        return `${sender.nickname}님이 당신을 팔로우했습니다.`;
      case NOTIFICATION_TYPE.RECOMMENT:
        return [
          `${sender.nickname}님이 당신의 댓글에 답글을 남겼습니다.`,
          <br key="br" />,
          `: ${target?.content}`
        ];
      case NOTIFICATION_TYPE.RANDOMBOX:
        return `${receiver.nickname}님! 랜덤박스가 도착했어요 내 쿠폰함을 확인해보세요!`;
      case NOTIFICATION_TYPE.GROUPAPPLY:
        return [
          `${sender.nickname}님이 [ ${target?.title} ] 에 함께 하려 합니다!`
        ];
      case NOTIFICATION_TYPE.GROUPAPPLY_APPROVE:
        return [
          `${receiver.nickname}님! [ ${target?.title} ] 그룹에 참여되었습니다.`
        ];
      case NOTIFICATION_TYPE.GROUPAPPLY_REJECT:
        return `${receiver.nickname}님 그룹 신청이 거절되었습니다.`;
      case NOTIFICATION_TYPE.ADMIN_NOTI:
        return `관리자 알림: 새로운 공지가 등록되었습니다.`;
      case NOTIFICATION_TYPE.ANIMAL_FRIENDS:
        return `누군가가 ${target?.aniName || '(내 반려동물)'}과(와) 친구가 되고 싶어해요!`;
      default:
        return '알 수 없는 알림';
    }
  };
  return (
    <Container isRead={noti.isRead} onClick={handleClick}>
      <IconWrapper>{renderIcon(noti.type)}</IconWrapper>
      <Content>
        <Title>{renderContent(noti)}</Title>
      </Content>
      <DeleteButton onClick={(e) => {
        e.stopPropagation();
        onDelete(noti.id);
      }} >
        <CloseOutlined />
      </DeleteButton>
    </Container>
  );
};

export default Notification;
