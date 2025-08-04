import React, {useEffect} from 'react';
import AppLayout from '../components/AppLayout';
import DetailCard from '../components/DetailCard';
import { useSelector } from 'react-redux';

const PostDetail = ()=>{
  const { mainPosts } = useSelector((state) => state.post); 

  return (
  <AppLayout>
    { mainPosts.map((c) => { 
      return (
      <DetailCard post={c} key={c.id} />
    );} )}
    {<CommentForm />}
  </AppLayout>
);
}

export default PostDetail;
