import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '@/components/AppLayout';
import GroupForm from '@/components/groups/GroupForm';
import { Typography, Card, message, Spin } from 'antd';
import { CREATE_GROUP_REQUEST, UPDATE_GROUP_REQUEST, LOAD_SINGLE_GROUP_REQUEST } from '@/reducers/group';
import wrapper from '@/store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '@/reducers/user';
import { END } from 'redux-saga';
import axios from 'axios';

const GroupFormPage = () => {
  const router = useRouter(); const dispatch = useDispatch();
  const {groupId} = router.query;

  const isEdit = !!groupId;
  const { singleGroup, loadSingleGroupLoading } = useSelector((state)=>state.group);
  //수정 시 기존 데이터 로드
  useEffect(()=>{
    if(isEdit){ dispatch({ type: LOAD_SINGLE_GROUP_REQUEST, data: groupId }); }
  }, [groupId]);
  
  const handleSubmit = (values) => {
    const categoryIds = values.categories;
    const openScopeId = values.isPrivate ? 2:1 ; 

    if(isEdit){ dispatch({ type: UPDATE_GROUP_REQUEST, data: { ...values, groupId } });
    } else { dispatch({ type: CREATE_GROUP_REQUEST, data: values }); }
  };

  const initialValues = isEdit && singleGroup ? {
    title: singleGroup.title,
    categories: singleGroup.Categories?.map((c)=>c.id),
    content: singleGroup.content,
    isPrivate: singleGroup.openScopeId === 2
  }: {};

  return (
    <AppLayout>
      <Card style={{ border:"none" }}> 
        <h1>{isEdit?'그룹수정':'그룹생성'}</h1>
        {isEdit && loadSingleGroupLoading ? (<Spin size='large'/>) : (
          <GroupForm
            mode={isEdit ? 'edit' : 'create' }
            initialValues={initialValues}
            onFinish={handleSubmit}
          />
        )}
      </Card>
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
  
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
///////////////////////////////////////////////////////////////////

export default GroupFormPage;
