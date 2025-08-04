import React, { useEffect } from 'react';
import { Avatar, Button, List, message, Popover, Space, Typography } from 'antd';
import { EllipsisOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { TRANSFER_OWNERSHIP_REQUEST, KICK_MEMBER_REQUEST } from '@/reducers/group';

const { Text } = Typography;

const GroupMember = ({ isLeader, groupId }) => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.group.members);
  const currentUserId = useSelector((state) => state.user.me?.id); // 로그인한 유저 ID
  const {transferOwnershipDone, kickMemberDone } = useSelector((state)=>state.group);

  const onTransferOwnership = (userId) =>{
    dispatch({ type: TRANSFER_OWNERSHIP_REQUEST, data:{ groupId:groupId, userId } });
  }

  const onKickMember = (userId) => {
    dispatch({type: KICK_MEMBER_REQUEST, data: {groupId, userId}});
  }

  useEffect(()=>{
    if(transferOwnershipDone){message.success('방장 권한을 위임했습니다.')}
  },[transferOwnershipDone])

  useEffect(()=>{
    if(kickMemberDone){message.success('강제 탈퇴가 성공적으로 완료되었습니다.');}
  }, [kickMemberDone])

  const renderActions = (member) => {
    if (isLeader) {
      return (
        <Space direction="vertical">
          <Button type="text" danger>차단하기</Button>
          {!member.isLeader && (
            <>
              <Button type="text" onClick={()=>onTransferOwnership(member.id)}>방장 권한 주기</Button>
              <Button type="text" danger onClick={()=>onKickMember(member.id)}>강퇴시키기</Button>
            </>
          )}
          <Button type="text" danger>신고하기</Button>
        </Space>
      );
    }
    return (
      <Space>
        <Button type="text">차단하기</Button>
        <Button type="text">신고하기</Button>
      </Space>
    );
  };

  return (
    <List
      style={{ padding: '0 15px' }}
      itemLayout="horizontal"
      dataSource={members}
      renderItem={(member) => {
        const isCurrentUser = member.id === currentUserId;

        return (
          <List.Item
            actions={
              !isCurrentUser
                ? [
                    <Button
                      type={member.isFollowing ? 'default' : 'primary'}
                      size="small"
                    >
                      {member.isFollowing ? '팔로우 중' : '팔로우하기'}
                    </Button>,
                    <Popover content={renderActions(member)} trigger="click">
                      <Button icon={<EllipsisOutlined />} style={{ border: 'none' }} />
                    </Popover>,
                  ]
                : []
            }
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <Space>
                  <Text strong>{member.nickname}</Text>
                  {member.isLeader && <Text type="secondary">| 방장</Text>}
                </Space>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default GroupMember;