import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

import AppLayout from "@/components/AppLayout";
import GroupList from '@/components/groups/GroupList';
import { Spin } from "antd";
import wrapper from "@/store/configureStore";
import axios from "axios";
import { LOAD_MY_INFO_REQUEST } from "@/reducers/user";
import { LOAD_GROUPS_REQUEST, LOAD_MEMBERS_REQUEST } from "@/reducers/group";
import { END } from "redux-saga";

const GroupListPage = ()=>{
  ////////////////////////////////////////////code
  const dispatch = useDispatch();
  const { groups, loadGroupsLoading } = useSelector((state)=>state.group);
  useEffect(()=>{dispatch({type: LOAD_GROUPS_REQUEST}); }, [] );
  ////////////////////////////////////////////view
  return(<AppLayout>
    <div style={{padding:'24px'}}>
      {loadGroupsLoading? (<Spin size="large"/>) : (
        groups &&  groups.map((g) => <GroupList key={g.id} g={g} /> ) 
      ) }
    </div>
  </AppLayout>); //E.Return
};
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
  context.store.dispatch({type: LOAD_GROUPS_REQUEST});
  context.store.dispatch({type: LOAD_MEMBERS_REQUEST});
  context.store.dispatch(END);

  await context.store.sagaTask.toPromise();
});
////////////////////////////////////////
export default GroupListPage;