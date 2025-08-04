import React from "react";
import AppLayout from "../../components/AppLayout";
import 'antd/dist/antd.css';
import axios from 'axios';
import wrapper from '../../store/configureStore';
import { END } from 'redux-saga';
import { useSelector } from "react-redux";

import PostCard from "../../components/post/PostCard";
import AdminProfile from "@/components/AdminProfile";

import { LOAD_MY_INFO_REQUEST } from "@/reducers/user";
import { LOAD_POSTS_REQUEST } from "@/reducers/post";

const adminPage = () => {
  const myId = useSelector(state => state.user.user?.id);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(state => state.post);

  return (
    <AppLayout>
      <>
        <AdminProfile isComplain={false} />
        {mainPosts
          .filter((post) => { return post.UserId === Number(myId) })
          .map((c) => {
            return (
              <PostCard post={c} key={c.id} />
            );
          })}
      </>
    </AppLayout>);
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
  context.store.dispatch(END);

  await context.store.sagaTask.toPromise();

});
////////////////////////////////////////////////////////
export default adminPage;
