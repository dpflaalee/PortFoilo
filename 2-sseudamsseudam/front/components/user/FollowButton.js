import React, { useCallback } from "react"; 
import { Button } from 'antd';
import PropTypes from "prop-types"; 
import { useSelector, useDispatch } from "react-redux"; 
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST, UNFOLLOW_SUCCESS } from "@/reducers/user"; 


const FollowButton = ({ postUser, setPostUser, currentUserId }) => {
  /////////////////////////////////////code
  const dispatch = useDispatch();
  const { user, followLoading, unFollowLoading } = useSelector(state => state.user);
  const isFollowing = user?.Followings.some((v) => v.id == postUser.id);
  
  const onClickFollow = useCallback(() => {

    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: postUser.id
      })
      setPostUser((prev) => ({
        ...prev,
        Followers: prev.Followers.filter((f) => f.id !== currentUserId),
      }));
    } else { 
      dispatch({
        type: FOLLOW_REQUEST,
        data: postUser.id,
        notiData: {
          SenderId: user.id,
          ReceiverId: postUser?.id,
        }
      })
      setPostUser((prev) => ({
        ...prev,
        Followers: [...prev.Followers, { id: currentUserId }],
      }));
    }
  }, [isFollowing, postUser.id]);
  /////////////////////////////////////view
  return (
    <Button loading={followLoading || unFollowLoading} onClick={onClickFollow}>
      {isFollowing ? '언팔로우' : '팔로우'}
    </Button>
  );
}

FollowButton.propTypes = {
  postUser: PropTypes.object.isRequired,
  setPostUser: PropTypes.func.isRequired,
  currentUserId: PropTypes.number.isRequired,
};
export default FollowButton;
