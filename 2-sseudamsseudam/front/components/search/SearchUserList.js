import { Avatar, Card, Typography, Space, Button, Popover, Modal, Row, Col } from 'antd';
import { EllipsisOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_BLOCK_REQUEST, REMOVE_BLOCK_REQUEST } from '@/reducers/user';
import ComplainForm from '../complains/ComplainForm';
import TARGET_TYPE from '../../../shared/constants/TARGET_TYPE';
import FollowButton from '../user/FollowButton';
const { Text } = Typography;
import Router from 'next/router';
import { LOAD_MY_INFO_REQUEST, LOAD_BLOCK_REQUEST, FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '@/reducers/user';

const SearchUserList = ({ user }) => {
  const dispatch = useDispatch();
  const [complainVisible, setComplainVisible] = useState(false);

  const me = useSelector(state => state.user);

  // 내정보 불러오기
  useEffect(() => {
    dispatch({ type: LOAD_MY_INFO_REQUEST });
  }, [dispatch]);

  /// 이동하기 방지
  const handleUserClick = (e) => {
    const tag = e.target.tagName;
    if (tag === 'BUTTON' || tag === 'svg' || tag === 'path') return;
    e.stopPropagation();
    Router.push(`/user/myPage/${user.id}`);
  };

  // 팔로우 된 유저인지 확인
  const [isFollowed, setIsFollowed] = useState(
    me.user?.Followings?.some((u) => u.id === user.id) || false
  );
  useEffect(() => {
    setIsFollowed(me.user?.Followings?.some((u) => u.id === user.id));
  }, [me.user?.Followings, user.id]);

  // 차단한 유저인지 확인
  const [isBlockedByMe, setIsBlockedByMe] = useState(
    me?.blocklist?.some((u) => u.id === user.id) || false
  );
  useEffect(() => {
    if (user && me.user) {
      const blocked = me?.user.Blocking?.some(u => u.id === user.id);
      setIsBlockedByMe(blocked);
    }
  }, [me.user?.Blockings, user.id]);


  const renderActions = (user) => (
    <Space>
      {!isBlockedByMe &&
        <Button type="text"
          onClick={(e) => {
            e.stopPropagation(); dispatch({ type: ADD_BLOCK_REQUEST, data: user.id });
            setIsBlockedByMe(true);
          }}
        >
          차단하기
        </Button>
      }
      <Button type="text"
        onClick={(e) => {
          e.stopPropagation(); setComplainVisible(true)
        }} danger>신고하기</Button>
    </Space >
  );
  return (
    <>
      <Card
        onClick={handleUserClick}
        style={{ cursor: 'pointer' }}
      >
        <Row justify="space-between" align="middle">
          {/* 왼쪽: 아바타 + 닉네임 */}
          <Col>
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Text strong>{user.nickname}</Text>
            </Space>
          </Col>

          {/* 오른쪽: 버튼 */}
          {me.user.id !== user.id ? (
            <Col>
              <Space>
                {isBlockedByMe ? (
                  <Button danger
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: REMOVE_BLOCK_REQUEST, data: user.id });
                      setIsBlockedByMe(false);
                    }}>
                    차단 해제
                  </Button>
                ) : <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({
                      type: isFollowed ? UNFOLLOW_REQUEST : FOLLOW_REQUEST,
                      data: user.id,
                      notiData: !isFollowed && {
                        SenderId: me.user.id,
                        ReceiverId: user.id,
                      }
                    });
                  }}
                >
                  {isFollowed ? '언팔로우' : '팔로우'}
                </Button>
                }
                <Popover content={renderActions(user)} trigger="click">
                  <Button icon={<EllipsisOutlined />} style={{ border: 'none' }} />
                </Popover>
              </Space>
            </Col>
          ) : (
            <Col>
              <Button type="primary" onClick={handleUserClick}>
                내 프로필로 이동
              </Button>
            </Col>
          )}
        </Row>
      </Card>

      <Modal
        open={complainVisible}
        onCancel={() => setComplainVisible(false)}
        footer={null}
        title="신고하기"
      >
        <ComplainForm targetId={user.id} targetType={TARGET_TYPE.USER} targetUserNickname={user.nickname} />
      </Modal>
    </>
  );
};

export default SearchUserList;
