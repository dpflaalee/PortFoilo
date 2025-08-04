import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import AppLayout from "@/components/AppLayout";
import PostForm from "@/components/post/PostForm";
import PostCard from "@/components/post/PostCard";
import GroupHeader from "@/components/groups/GroupHeader";
import GroupMember from "@/components/groups/GroupMember";
import GroupJoinRequests from "@/components/groups/GroupJoinRequests";
import wrapper from "@/store/configureStore";
import axios from "axios";
import { END } from "redux-saga";
import { LOAD_GROUPS_REQUEST, LOAD_JOIN_REQUESTS_REQUEST, LOAD_MEMBERS_REQUEST, LOAD_SINGLE_GROUP_REQUEST } from "@/reducers/group";
import { LOAD_MY_INFO_REQUEST } from "@/reducers/user";
import { LOAD_POSTS_REQUEST } from "@/reducers/post";

const GroupMain = () => {
  const router = useRouter();
  const { id: groupId } = router.query;
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("timeline");

  const group = useSelector((state) => state.group.singleGroup);
  const members = useSelector((state) => state.group.members);
  const currentUserId = useSelector((state) => state.user.user?.id);

  // 방장 여부 판별
  // const isLeader = members?.some((member) => member.id === currentUserId && member.isLeader );
  const isLeader = members?.some(
    (member) => 
      member.id === currentUserId && 
      (member.isLeader === true || member.isLeader === 1)
  );

  //승인/거절용 가입 멤버 불러오기
  useEffect(()=>{
    if(groupId){
      dispatch({type: LOAD_SINGLE_GROUP_REQUEST, data:groupId})
      dispatch({type: LOAD_MEMBERS_REQUEST, data:groupId});
    }
    if(isLeader){
      dispatch({type:LOAD_JOIN_REQUESTS_REQUEST, data: groupId});
    }
  },[groupId, dispatch, isLeader])

  return (
    <AppLayout group={group} members={members}>
      <GroupHeader
        groupId={groupId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLeader={isLeader}
        title={group?.title}
      />
      {activeTab === "timeline" && (
        <>
          <PostForm groupId={groupId} isGroup />
          {group?.Posts?.map((post) => (
            <PostCard key={post.id} post={post} isGroup />
          ))}
        </>
      )}
      {activeTab === "members" && (
        <GroupMember groupId={groupId} isLeader={isLeader} />
      )}
      {activeTab === "joinRequests" && isLeader && (
        <GroupJoinRequests groupId={groupId}    />
      )}
    </AppLayout>
  );
};

////////////////////////////////////////
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  const groupId = context.params?.id; 

  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
  context.store.dispatch({ type: LOAD_POSTS_REQUEST });
  context.store.dispatch({ type: LOAD_GROUPS_REQUEST });

  if (groupId) {
    context.store.dispatch({ type: LOAD_SINGLE_GROUP_REQUEST, data: groupId });
    context.store.dispatch({ type: LOAD_MEMBERS_REQUEST, data: groupId });
    context.store.dispatch({ type: LOAD_JOIN_REQUESTS_REQUEST, data: groupId });
  }

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
////////////////////////////////////////

export default GroupMain;
