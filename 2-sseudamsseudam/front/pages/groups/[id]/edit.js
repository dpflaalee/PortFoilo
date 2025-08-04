import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import AppLayout from '@/components/AppLayout';
import GroupForm from '@/components/groups/GroupForm';
import { LOAD_MEMBERS_REQUEST, LOAD_SINGLE_GROUP_REQUEST, UPDATE_GROUP_REQUEST } from '@/reducers/group';
import wrapper from '@/store/configureStore';
import { END } from 'redux-saga';
import { LOAD_MY_INFO_REQUEST } from '@/reducers/user';
import axios from 'axios';

const EditGroupPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id: groupId } = router.query;
  const loading = useSelector((state) => state.group.updateGroupLoading);


  const group = useSelector((state) => state.group.singleGroup);  // 변경된 상태 이름
  const currentUser = useSelector((state) => state.user.user);
  const members = useSelector((state) => state.group.members);
  
  // 멤버 배열에서 isLeader 판별
  const isLeader = members?.some(m => m.id === currentUser?.id && m.isLeader);

  // 클라이언트에서 그룹 데이터 요청
  useEffect(() => {
    if (router.isReady && groupId) {
      dispatch({
        type: LOAD_SINGLE_GROUP_REQUEST,
        data: groupId,
      });
      dispatch({
        type: LOAD_MEMBERS_REQUEST,
        data: groupId,
      });
    }
  }, [router.isReady, groupId]);

  // 수정 완료 시 상세 페이지로 이동
  const { updateGroupDone } = useSelector((state) => state.group);
  useEffect(() => {
    if (updateGroupDone) {
      router.push(`/groups/${groupId}`);
    }
  }, [updateGroupDone]);

  const handleSubmit = (formData) => {
    dispatch({
      type: UPDATE_GROUP_REQUEST,
      data: { groupId, ...formData },
    });
  };

  return (
    <AppLayout group={group}>
      {group ? (
        <GroupForm
          groupId={groupId}
          initialValues={{
            title: group.title,
            content: group.content,
            categories: group.Categories?.map((c) => c.id),
            isPrivate: group.OpenScope?.id === 2,
          }}
          onFinish={handleSubmit}
          mode="edit"
          isEditing={true}
          loading={loading}
        />
      ) : (
        <p>그룹 정보를 불러오는 중입니다...</p>
      )}
    </AppLayout>
  );
};

// SSR
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  const groupId = context.params?.id;

  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
  if (groupId) {
    context.store.dispatch({ type: LOAD_SINGLE_GROUP_REQUEST, data: groupId });
    context.store.dispatch({ type: LOAD_MEMBERS_REQUEST, data: groupId });
  }

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default EditGroupPage;
