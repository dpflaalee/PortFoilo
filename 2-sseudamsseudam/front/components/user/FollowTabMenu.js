import React,{useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import { useDispatch } from 'react-redux';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWERS_SUCCESS } from '@/reducers/user'
import FollowList from './FollowList';
import FollowButton from './FollowButton';

const FollowTabMenu = ({ followListComponent }) => {
  const dispatch = useDispatch();
  const {user,followerList} = useSelector(state => state.user);
  const [toggleKey, setToggleKey] = useState('');
  const onChange = (key) => {
    setToggleKey(key);
  };

  useEffect(() => {
    if(user?.id){
      dispatch({
        type:LOAD_FOLLOWERS_REQUEST,
        data:user?.id,
      })
    }
  },[user?.id])

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        onChange={onChange}
        tabBarGutter={70}
        style={{ paddingLeft: '10px' }}
        items={[
          {
            label: `팔로우`,
            key: '1',
            children: followListComponent,
          },
          {
            label: `팔로잉`,
            key: '2',
            children: `Content of Tab Pane 2`,
          },
        ]}
      />
      {followerList.map((c) => {
        return (
          <div>
            <FollowList follower={c} key={1}/>
            <FollowButton postUser={c} setPostUser={setPostUser} currentUserId={user?.id}/> 
          </div>
        )
      })}
    </>
  );
}
export default FollowTabMenu;
