import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Profile from '@/components/user/Profile';
import PostCard from '@/components/post/PostCard';

import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import { useRouter } from 'next/router';
import axios from 'axios';
import wrapper from '@/store/configureStore';
import { LOAD_USER_POSTS_REQUEST } from '../../../reducers/post';
import { LOAD_BLOCK_REQUEST, LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from '../../../reducers/user';
import { LOAD_COMPLAIN_REQUEST } from '@/reducers/complain';
import TARGET_TYPE from '../../../../shared/constants/TARGET_TYPE';
import { LOAD_POSTS_REQUEST } from '../../../reducers/post';
import MyPrize from '@/components/Prize/MyPrize';
import AnimalList from '@/components/animal/AnimalList';
import { LOAD_USER_ANIMAL_LIST_REQUEST } from '@/reducers/animal';

const MyPage = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.user)
    const { mainPosts } = useSelector(state => state.post)
    const router = useRouter();
    const { myPage } = router.query;
    const [postUser, setPostUser] = useState(null);
    const { myAnimals, selectedAnimal } = useSelector((state) => state.animal);
    const { userDetailAnimals } = useSelector((state) => state.animal);

    // 신고 당한 유저 블라인드 처리
    const { mainComplainCard } = useSelector((state) => state.complain);

    const isBlinded = mainComplainCard.some((report) => {
        return Number(report.targetId) === Number(myPage) && report.isBlind && report.targetType === TARGET_TYPE.USER;
    });
    ////////////////////////////
    useEffect(() => {
        dispatch({
            type: LOAD_COMPLAIN_REQUEST,
        });
    }, [dispatch]);

    useEffect(() => {
        dispatch({
            type: LOAD_POSTS_REQUEST,
        });
    }, [dispatch]);

    useEffect(() => {
        if (myPage) {
            dispatch({ type: LOAD_USER_ANIMAL_LIST_REQUEST, data: Number(myPage) });
        }
    }, [myPage]);



    const [showMyPrize, setShowMyPrize] = useState(false); // "내 쿠폰함" 상태

    const onShowMyPrize = () => {
        setShowMyPrize(prev => !prev); // "내 쿠폰함" 버튼 클릭 시 상태 토글
    };

    // 나를 차단했는지
    const [isBlockedMe, setIsBlockedMe] = useState(false);
    useEffect(() => {
        const fetchPostUser = async () => {
            try {
                const res = await axios.get(`http://localhost:3065/user/postUser?userId=${myPage}`, {
                    withCredentials: true,
                });
                setPostUser(res.data);
                setIsBlockedMe(res.data.isBlockedMe);
            } catch (err) {
                console.error('postUser 조회 실패', err);
            }
        };
        if (myPage) fetchPostUser();
    }, [myPage]);
    if (isBlockedMe) {
        return (
            <AppLayout>
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    나를 차단했습니다.
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Profile
                postUserId={myPage}
                postUser={postUser}
                setPostUser={setPostUser}
                mainPosts={mainPosts}
                onShowMyPrize={onShowMyPrize}
                isMyProfile={user?.id === myPage}
            />
            <AnimalList animals={userDetailAnimals} ownerId={Number(myPage)} />
            {/* "내 쿠폰함" 버튼을 클릭했을 때 MyPrize만 렌더링 */}
            {showMyPrize ? (
                <MyPrize />
            ) : (
                // 기본적으로 게시물이 보이게
                // !isBlinded && mainPosts.map((post) => {
                //     return <PostCard post={post} key={post.id} />;
                // })
                
                !isBlinded && mainPosts.filter((post) => {
                    return post.UserId === Number(myPage)
                })
                .map((post) => {
                    return <PostCard post={post} key={post.id} />;
                })
            )}
        </AppLayout>
    );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const { myPage } = context.params;
    //1. cookie 설정
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    if (context.req && cookie) { axios.defaults.headers.Cookie = cookie; }
    //2. redux 액션
    context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    context.store.dispatch({ type: LOAD_COMPLAIN_REQUEST });
    context.store.dispatch({ type: LOAD_POSTS_REQUEST });
    context.store.dispatch({ type: LOAD_BLOCK_REQUEST });
    //context.store.dispatch({ type: LOAD_USER_POSTS_REQUEST  , data: context.params.myPage,});
    //context.store.dispatch({ type: LOAD_USER_REQUEST,   data: context.params.myPage, });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
    const state = context.store.getState();

});


export default MyPage;