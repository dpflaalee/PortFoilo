import React,{useEffect} from "react";
import AppLayout from "@/components/AppLayout";
import FollowTabMenu from "@/components/user/FollowTabMenu";
import Profile from "@/components/user/Profile";

import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import { useRouter } from 'next/router';
import axios from 'axios';
import wrapper from '../../../../store/configureStore';
import { LOAD_USER_POSTS_REQUEST } from '../../../../reducers/post';
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from '../../../../reducers/user';
import FollowList from "@/components/user/FollowList";
const MyFollow = () => {
    const router = useRouter();
    const {myFollow} = router.query;
    let postUserId = myFollow;
    const {followerList} = useSelector(state => state.user);
    console.log('myPage222',myFollow );
    //const {myPage} = router.query;
    useEffect(() => {
      if (!router.isReady) return;
      
    }, [router.isReady]);
////////////////////////////////////////////////
    //useEffect(() => {
    const postUserData = async () => {
      try {
        const postUserSelect = await axios.get(`http://localhost:3065/user/postUser?userId=${postUserId}`,
          { withCredentials: true }
        )
        console.log('postUserSelect.data',postUserSelect.data);
        setPostUser(postUserSelect.data);

      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
      }
    };
//   postUserData();
 // }, [postUserId]);
////////////////////////////
{/* <Profile
                postUserId={myPage}
                postUser={postUser}
                setPostUser={setPostUser}
                mainPosts={mainPosts}
                onShowMyPrize={onShowMyPrize}
                isMyProfile={user?.id === myPage}
            /> */}
  return (
    <AppLayout>
      <Profile postUserId={myFollow} />
      {/* followList에 1 = 팔로우, 2 = 팔로잉을 보낸다 */}
      <FollowTabMenu  />
    </AppLayout>
  );
}
////////////////////////////////////////
export const getServerSideProps = wrapper.getServerSideProps( async (context) => {
  //1. cookie설정
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  if(context.req && cookie){
    axios.defaults.headers.Cookie = cookie;
  }
  //2. redux 액션
  context.store.dispatch({type:LOAD_MY_INFO_REQUEST});
  //context.store.dispatch({type:LOAD_POSTS_REQUEST});
  context.store.dispatch(END);

  await context.store.sagaTask.toPromise();
});
////////////////////////////////////////
export default MyFollow;