// pages/post/[postId].js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DetailCard from '@/components/detail/DetailCard';
import { useRouter } from 'next/router';

import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_COMPLAIN_REQUEST } from '@/reducers/complain';
import { END } from 'redux-saga';
import AppLayout from '@/components/AppLayout';

const PostDetailPage = () => {
  const router = useRouter();
  const { postId } = router.query;
  const [post, setPost] = useState(null);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    try {
      const response = await axios.get(`http://localhost:3065/post/${postId}`);
      setPost(response.data);
    } catch (error) {
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (!post) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <AppLayout>
    <DetailCard post={post} onRefreshPost={fetchPost} />
    </AppLayout>
  );
};

//////////////////////////////////
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
  context.store.dispatch({ type: LOAD_COMPLAIN_REQUEST });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();

  return { props: {} };
});
///////////////////////////////////
export default PostDetailPage;
