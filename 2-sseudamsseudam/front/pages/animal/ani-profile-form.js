import React from 'react';
import AniProfileForm from '@/components/animal/AniProfileForm';
import AppLayout from '@/components/AppLayout';
import wrapper from '@/store/configureStore'; 
import axios from 'axios';
import { END } from 'redux-saga'; 
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_CATEGORIES_REQUEST } from '@/reducers/category';

const AniProfileFormPage = () => {
  return (
    <AppLayout>
      <AniProfileForm />
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
  context.store.dispatch({ type: LOAD_CATEGORIES_REQUEST });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();

  return { props: {} }; 
});
///////////////////////////////////

export default AniProfileFormPage;


