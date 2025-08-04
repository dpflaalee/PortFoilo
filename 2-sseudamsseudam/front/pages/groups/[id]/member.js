import React from 'react';
import AppLayout from '@/components/AppLayout';
import GroupMember from '@/components/groups/GroupMember';
import { LOAD_MY_INFO_REQUEST } from '@/reducers/user';
import { APPLY_GROUP_REQUEST, JOIN_GROUP_REQUEST, LOAD_MEMBERS_REQUEST } from '@/reducers/group';
import { useRouter } from 'next/router';

const GroupMembersPage = () => {
  const router = useRouter();
  const groupId = parseInt(router.query.id, 10)

  return (
    <AppLayout>
      <h1 style={{ margin: '16px 0' }}>멤버 리스트</h1>
      <GroupMember isLeader={isLeader} groupId={groupId} />
    </AppLayout>
  );
};

///////////////////////////////////////////////////////////////////
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST,  });
  context.store.dispatch({ type: LOAD_MEMBERS_REQUEST,  });
  context.store.dispatch({ type: APPLY_GROUP_REQUEST  });
  context.store.dispatch({ type: JOIN_GROUP_REQUEST  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
///////////////////////////////////////////////////////////////////

export default GroupMembersPage;
