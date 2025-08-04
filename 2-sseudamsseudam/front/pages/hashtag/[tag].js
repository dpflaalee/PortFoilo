import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from 'axios';

import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/post/PostCard";

const Hashtag = () => {
  const router = useRouter();
  const {tag} = router.query;
  const [ mainPosts, setMainPosts ] = useState([]);
  const [ hasMorePosts, setHasMorePosts ] = useState(true);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  /////////////////////////// code
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const hashtagResponse = await axios.get( `http://localhost:3065/hashtag/${tag}`, {withCredentials:true} );
        setMainPosts(hashtagResponse.data);
        setHasMorePosts(hashtagResponse.data.length > 0);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if(tag){fetchData();}
  },[tag]);  

  useEffect(() => {
    const onScroll = () => {
      if(window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 200) {
        if( hasMorePosts && !loadPostsLoading ) {
          axios.get( `http://localhost:/3065/hashtag/${tag}?lastId=${mainPosts[mainPosts.length-1]?.id}` , {withCredentials : true} )
            .then((hashtagResponse) => {
              setMainPosts((prev) => [ ...prev, ...hashtagResponse.data ]);
              setHasMorePosts( hashtagResponse.data.length > 0 );
            })
            .catch((err) => setError(err));
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  },[mainPosts, hasMorePosts, tag, loading]);  

  if( loading ) { return <div>해쉬태그 게시글 ing ...</div>; }
  if( error ) { return <div> error ...</div>; }

  /////////////////////////// view
  return(
    <AppLayout>
      { mainPosts.map((c) => { 
        return ( <PostCard post={c} key={c.id} /> );} )}
    </AppLayout>
  );  
};

export default Hashtag;