import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from "antd";
import PostCard from '@/components/post/PostCard';
import PostForm from '@/components/post/PostForm';
import Comment from '@/components/comment/Comment';
import Profile from '@/components/user/Profile';
import NotificationButton from "@/components/notifications/NotificationButton";
import { LOAD_POSTS_REQUEST } from '@/reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_COMPLAIN_REQUEST } from '@/reducers/complain';
import wrapper from '../../store/configureStore';
import { END } from 'redux-saga';
import AnimalList from '@/components/animal/AnimalList';
import TARGET_TYPE from '../../../shared/constants/TARGET_TYPE';
import { LOAD_NOTIFICATION_REQUEST } from '@/reducers/notification';
import Router from 'next/router';
import { Modal } from 'antd';

//// import 수정
const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(state => state.post);
  const { mainComplainCard } = useSelector((state) => state.complain);
  const [alreadyChecked, setAlreadyChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!alreadyChecked && user && mainComplainCard.length > 0) {
      const isBlinded = mainComplainCard.some(
        (report) =>
          report.targetType === TARGET_TYPE.USER &&
          Number(report.targetId) === Number(user.id) &&
          report.isBlind
      );
      if (isBlinded) {
        setModalVisible(true);
        setAlreadyChecked(true);
      }
    }
  }, [user, mainComplainCard, alreadyChecked]);

  const handleModalOk = async () => {
    await Router.replace('/');
    setModalVisible(false);
  };

// 최초 로딩
useEffect(() => {
  if (mainPosts.length === 0) {
    dispatch({
      type: LOAD_POSTS_REQUEST,
      lastId: 0,
      userId: 'undefined',  
      number: '1',         
    });
  }
}, []);

// 무한 스크롤
useEffect(() => {
  const onScroll = () => {
    const scrollY = window.scrollY;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollY + clientHeight > scrollHeight - 200) {
      if (hasMorePosts && !loadPostsLoading) {
        const lastId = mainPosts[mainPosts.length - 1]?.id;
        dispatch({
          type: LOAD_POSTS_REQUEST,
          lastId,
          userId: 'undefined', 
          number: '1',
        });
      }
    }
  };

  window.addEventListener('scroll', onScroll);
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}, [mainPosts, hasMorePosts, loadPostsLoading]);

  // 신고 당한 유저 글 보이지 않게 처리
  useEffect(() => {
    dispatch({
      type: LOAD_COMPLAIN_REQUEST,
    });
  }, [dispatch]);

  return (
    <>
      <Modal
        title="로그인 제한"
        visible={modalVisible}
        onOk={handleModalOk}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>신고 누적으로 인해 로그인이 제한되었습니다.</p>
      </Modal>
      <AppLayout>

        {user && <PostForm />}
        {mainPosts
          .filter((post) => {
            const openScope = post.OpenScope?.content;
            const myId = user?.id;
            const postOwnerId = post.UserId;

            const isUserBlinded = mainComplainCard.some(
              (report) => report.targetId === post.User?.id && report.isBlind && report.targetType === TARGET_TYPE.USER
            );
            // 신고된 유저의 글을 제외
            if (isUserBlinded) return false;

            if (myId === postOwnerId) return true;

            // 전체공개
            if (openScope === 'public') return true;

            // 나만 보기
            if (openScope === 'private') return false;

            // 팔로워 공개
            const followings = user?.Followings?.map(u => u.id) || [];
            if (openScope === 'follower') {
              return followings.includes(postOwnerId);
            }
            // 그룹은 홈에서 제외
            if (openScope === 'group') return false;
            return false;
          })
          .map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
      </AppLayout>
    </>
  );
}

////////////////////////////////////////////////////////
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  //1. cookie 설정
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) { axios.defaults.headers.Cookie = cookie; }

  //2. redux 액션
  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
  context.store.dispatch({ type: LOAD_POSTS_REQUEST });
  context.store.dispatch({ type: LOAD_COMPLAIN_REQUEST });
  context.store.dispatch({ type: LOAD_NOTIFICATION_REQUEST });
  context.store.dispatch(END);

  await context.store.sagaTask.toPromise();

});
////////////////////////////////////////////////////////

export default Home;
