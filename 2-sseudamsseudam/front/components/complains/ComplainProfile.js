import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import styled from 'styled-components';
import { MoreOutlined } from '@ant-design/icons';
import ComplainForm from './ComplainForm';
import TARGET_TYPE from '../../../shared/constants/TARGET_TYPE';
import useSelection from 'antd/lib/table/hooks/useSelection';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_OUT_REQUEST, USER_DELETE_REQUEST } from '@/reducers/user';
import { LOAD_POSTS_REQUEST } from '@/reducers/post'
import Router from 'next/router';
import PostCard from '../post/PostCard';
import axios from 'axios';

const Wrapper = styled.div`
  width: 100%;
  background-color: #f0f2f5;
`;

const Banner = styled.div`
  height: 160px;
  background-color: skyblue;
  position: relative;
`;

const Container = styled.div`
  background-color: #fff;
  padding: 24px 16px 16px;
  border-radius: 12px;
  margin: -60px auto 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  max-width: 600px;
  position: relative;
`;

const AvatarBox = styled.div`
  position: absolute;
  top: -40px;
  left: 24px;
  border: 4px solid white;
  border-radius: 50%;
  background-color: white;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  margin-left: 96px; 
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nickname = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const Stats = styled.div`
  margin-top: 4px;
  color: #555;
`;

const ButtonRow = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 8px;
`;

const DropdownBox = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const Profile = (props) => {
  const dispatch = useDispatch();
  const { logOutDone, user } = useSelector(state => state.user);
  const { logOutLoding, mainPosts, hasMorePosts, loadPostsLoading } = useSelector(state => state.post);

  let postUserId = props.postUserId;
  const [postUser, setPostUser] = useState('');
  useEffect(() => {
    const postUserData = async () => {
      try {
        const postUserSelect = await axios.get(`http://localhost:3065/user/postUser?userId=${postUserId}`,
          { withCredentials: true }
        )
        setPostUser(postUserSelect.data);

      } catch (error) {
      }
    };
    postUserData();
  }, [postUserId]);

  useEffect(() => {
    const lastId = mainPosts[mainPosts.length - 1]?.id;
    const number = [1, 2, 3];
    if (hasMorePosts && !loadPostsLoading) {
      if (postUserId) {
        if (user.id == props.postUserId) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
            number: number[0],
          })
        } else {
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
            userId: postUserId,
            number: number[1],
          })
        }
      } else {
        dispatch({
          type: LOAD_POSTS_REQUEST,
          lastId,
        })
      }
    }
  }, [mainPosts, hasMorePosts, loadPostsLoading]);
  useEffect(() => {
    if (logOutDone) {
      Router.replace('/');
    }
  }, [logOutDone])

  const [open, setOpen] = useState(false);
  const onLogout = useCallback(() => {
    dispatch({ type: LOG_OUT_REQUEST })
  });
  const [] = useState(false);
  const onUserDelete = useCallback(() => {
    dispatch({
      type: USER_DELETE_REQUEST,
    })
  });

  const isMyProfile = user && (user.id == postUserId);

  const menu = (
    <Menu>
      {isMyProfile ? (
        <>
          <Menu.Item key="edit">프로필 수정</Menu.Item>
          <Menu.Item key="change-password">비밀번호 변경</Menu.Item>
          <Menu.Item key="logout" onClick={onLogout}>
            {logOutLoding ? '로그아웃 중...' : '로그아웃'}
          </Menu.Item>
          <Menu.Item key="withdraw" onClick={onUserDelete} danger>
            탈퇴하기
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item key="report" onClick={() => setOpen(true)} danger>
            신고하기
          </Menu.Item>
          <ComplainForm
            open={open}
            onClose={() => setOpen(false)}
            TARGET_TYPE={TARGET_TYPE.USER}
            targetId={postUserId}
            targetUserNickname={postUser?.nickname}
            targetUser={postUser}
          />
        </>
      )}
    </Menu>
  );

  return (
    <Wrapper>
      <Banner />
      <Container>
        <AvatarBox>
          <Avatar size={80} >
            {postUser?.nickname}
          </Avatar>
        </AvatarBox>

        <DropdownBox>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </DropdownBox>

        <TopRow>
          <InfoBox>
            <Nickname>{postUser?.nickname}</Nickname>
            <Stats>
              {postUser?.followerCount} 팔로잉  &nbsp;&nbsp;
              {postUser?.followingCount} 팔로워 &nbsp;&nbsp;
              {mainPosts?.length} 게시물
            </Stats>
          </InfoBox>
        </TopRow>
        {isMyProfile ? (
          <ButtonRow>
            <Button type="primary">내 쿠폰함</Button>
            <Button>내 장소</Button>
            <Button>챌린지 현황</Button>
            <Button>프로필 수정</Button>
          </ButtonRow>
        ) : (
          <ButtonRow>
            <Button type="primary">팔로우</Button>
            <Button>장소</Button>
          </ButtonRow>
        )}
      </Container>

    </Wrapper>
  );
};

export default Profile;
