import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Avatar, Button, List, Popover, Modal, Input, Space, Select } from 'antd';
import { EllipsisOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, RetweetOutlined } from '@ant-design/icons';
import PostImages from '../post/PostImages';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/Link';
import { LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, REMOVE_POST_REQUEST, UPDATE_POST_REQUEST, RETWEET_REQUEST } from '@/reducers/post';
import ComplainForm from './ComplainForm';
import TARGET_TYPE from '../../../shared/constants/TARGET_TYPE';
import PostCardContent from '../post/PostCardContent';

import { ADD_NOTIFICATION_REQUEST } from '@/reducers/notification'
import NOTIFICATION_TYPE from '../../../shared/constants/NOTIFICATION_TYPE';

const PawIcon = ({ filled = false, style = {}, onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="18"
    height="18"
    style={{ cursor: 'pointer', ...style }}
  >
    <title>Paw Icon</title>
    <path
      d="M457.74,170.1a30.26,30.26,0,0,0-11.16-2.1h-.4c-20.17.3-42.79,19.19-54.66,47.76-14.23,34.18-7.68,69.15,14.74,78.14a30.21,30.21,0,0,0,11.15,2.1c20.27,0,43.2-19,55.17-47.76C486.71,214.06,480.06,179.09,457.74,170.1Z"
      fill={filled ? "#000" : "none"}
      stroke="#000"
      strokeMiterlimit="10"
      strokeWidth="32"
    />
    <path
      d="M327.6,303.48C299.8,257.35,287.8,240,256,240s-43.9,17.46-71.7,63.48c-23.8,39.36-71.9,42.64-83.9,76.07a50.91,50.91,0,0,0-3.6,19.25c0,27.19,20.8,49.2,46.4,49.2,31.8,0,75.1-25.39,112.9-25.39S337,448,368.8,448c25.6,0,46.3-22,46.3-49.2a51,51,0,0,0-3.7-19.25C399.4,346,351.4,342.84,327.6,303.48Z"
      fill={filled ? "#000" : "none"}
      stroke="#000"
      strokeMiterlimit="10"
      strokeWidth="32"
    />
    <path
      d="M192.51,196a26.53,26.53,0,0,0,4-.3c23.21-3.37,37.7-35.53,32.44-71.85C224,89.61,203.22,64,181.49,64a26.53,26.53,0,0,0-4,.3c-23.21,3.37-37.7,35.53-32.44,71.85C150,170.29,170.78,196,192.51,196Z"
      fill={filled ? "#000" : "none"}
      stroke="#000"
      strokeMiterlimit="10"
      strokeWidth="32"
    />
    <path
      d="M366.92,136.15c5.26-36.32-9.23-68.48-32.44-71.85a26.53,26.53,0,0,0-4-.3c-21.73,0-42.47,25.61-47.43,59.85-5.26,36.32,9.23,68.48,32.44,71.85a26.53,26.53,0,0,0,4,.3C341.22,196,362,170.29,366.92,136.15Z"
      fill={filled ? "#000" : "none"}
      stroke="#000"
      strokeMiterlimit="10"
      strokeWidth="32"
    />
    <path
      d="M105.77,293.9c22.39-9,28.93-44,14.72-78.14C108.53,187,85.62,168,65.38,168a30.21,30.21,0,0,0-11.15,2.1c-22.39,9-28.93,44-14.72,78.14C51.47,277,74.38,296,94.62,296A30.21,30.21,0,0,0,105.77,293.9Z"
      fill={filled ? "#000" : "none"}
      stroke="#000"
      strokeMiterlimit="10"
      strokeWidth="32"
    />
  </svg>
);

const PostCard = ({ post, isGroup = false }) => { // 그룹용 추가코드
  const id = useSelector(state => state.user.user?.id);
  const [open, setOpen] = useState(false);
  const { Option } = Select;
  const dispatch = useDispatch();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const onCancelUpdate = useCallback(() => { setEditMode(false); }, []);
  const onEditPost = useCallback((editText) => () => {
    dispatch({
      type: UPDATE_POST_REQUEST,
      data: { PostId: post.id, content: editText }
    });
  }, [post]);

  const [newContent, setNewContent] = useState(post.content);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { removePostLoading, removePostDone } = useSelector(state => state.post);
  const { mainComplainCard } = useSelector(state => state.complain);

  // 좋아요
  const onClickLike = useCallback(() => {
    if (!id) { return alert('로그인을 하시면 좋아요 추가가 가능합니다.'); }
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id
    });
    dispatch({
      type: ADD_NOTIFICATION_REQUEST,
      data: {
        notiType: NOTIFICATION_TYPE.LIKE,
        SenderId: id,
        ReceiverId: post.User.id,
        targetId: post.id,
      }
    });
  }, [id]);

  const onClickunLike = useCallback(() => {
    if (!id) { return alert('로그인을 하시면 좋아요 추가가 가능합니다.'); }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id
    });
  }, [id]);

  const like = post.Likers?.find((v) => v.id === id);

  //수정
  const openEditModal = useCallback(() => {
    setEditModalVisible(true);
  }, []);
  const closeEditModal = useCallback(() => {
    setEditModalVisible(false);
  }, []);
  const handleEditSubmit = useCallback(() => {
    if (newContent.trim() === post.content.trim()) {
      return closeEditModal();
    }
    dispatch({
      type: UPDATE_POST_REQUEST,
      data: { PostId: post.id, content: newContent }
    });
    setEditModalVisible(false);
  }, [newContent, post, dispatch]);

  //삭제
  const openDeleteModal = () => {
    setDeleteModalVisible(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
  };
  const handleDelete = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id
    });
  }, []);

  // 리트윗
  const onRetweet = useCallback(() => {
    if (!id) { return alert('로그인 후 리트윗이 가능합니다.'); }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
      notiData: {
        SenderId: id, // 로그인한 유저의 아이디
        ReceiverId: post.User.id
      }
    });
  });


  return (
    <div style={{ margin: '3%' }}>
      <Card
        title={isGroup ? `[그룹]${post.User?.nickname}` : post.User?.nickname} // 그룹용 추가코드
        cover={
          post.Images && post.Images.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PostImages images={post.Images} />
            </div>
          )
        }
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          like
            ? <span key="heart"><PawIcon filled={true} style={{ fontSize: '32px' }} onClick={onClickunLike} /> {post.Likers.length}</span>
            : <span key="heart"><PawIcon filled={false} style={{ fontSize: '32px' }} onClick={onClickLike} /> {post?.Likers?.length}</span>,
          <span key="comment">
            <Link href={`/post/${post.id}`} passHref>
              <MessageOutlined /> {post.Comments?.filter(comment => !comment.RecommentId).length || 0}
            </Link>
          </span>,
          <Popover content={(
            <Button.Group>
              <>
                <Button onClick={openEditModal}>수정</Button>
                <Button type="danger" onClick={openDeleteModal}>삭제</Button>
              </>
              <>
                <Button onClick={() => setOpen(true)}>신고하기</Button>
              </>
            </Button.Group>
          )}>
            < EllipsisOutlined />
          </Popover>
        ]}
      // extra={<>{id && id !== post.User.id && <FollowButton post={post} />}</>}
      >

        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images && post.Retweet.Images.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <PostImages images={post.Retweet.Images} />
                </div>
              )
            }
          >
            <Card.Meta
              avatar={<Link href={`/user/myPage/${post.Retweet.User.id}`} prefetch={false}>
                <Avatar>{post.Retweet.User.nickname[0]}</Avatar></Link>}
              title={post.Retweet.User.nickname}
              description={
                <PostCardContent
                  editMode={editMode}
                  onEditPost={onEditPost}
                  onCancelUpdate={onCancelUpdate}
                  postData={post.Retweet.content}
                />}
            />
            {post.Images && post.Images.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <PostImages images={post.Images} />
              </div>
            )}
          </Card>
        ) : (
          <Card.Meta
            avatar={
              <Link href={`/user/myPage/${post?.User?.id}`} prefetch={false}>
                <Avatar>{post.User?.nickname[0]}</Avatar>
              </Link>
            }
            title={post.User?.nickname}
            description={
              <PostCardContent
                editMode={editMode}
                onEditPost={onEditPost}
                onCancelUpdate={onCancelUpdate}
                postData={post.content}
              />
            }
          />

        )
        }
        {/* 신고 모달 */}
        {open && (
          <ComplainForm
            open={open}
            targetId={post.Retweet ? post.Retweet.id : post.id}
            TARGET_TYPE={TARGET_TYPE.POST}
            targetUserNickname={post.User?.nickname}
            onClose={() => setOpen(false)}
          />
        )}
        {/* E 신고 모달 */}
      </Card >

      <Modal
        visible={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={closeEditModal}
        footer={null}
        width={600}
      >
        <div style={{ display: 'flex', marginBottom: 16 }}>
          <span style={{ fontSize: 18, fontWeight: 'bold', marginRight: '10px' }}>게시물 수정</span>
          <Space>
            <Select defaultValue="public" style={{ width: 120 }}>
              <Option value="public">전체공개</Option>
              <Option value="friends">친구공개</Option>
              <Option value="private">비공개</Option>
            </Select>
          </Space>
        </div>

        <Input.TextArea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={4}
          placeholder="내용을 수정하세요"
        />

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button onClick={handleEditSubmit} type="primary">
            수정 완료
          </Button>
        </div>
      </Modal>
      <Modal
        title="게시물 삭제"
        visible={deleteModalVisible}
        onOk={handleDelete}
        onCancel={closeDeleteModal}
        okText="삭제"
        cancelText="취소"
        cancelButtonProps={{ danger: true }}
      >
        <p>이 게시물을 정말 삭제하시겠습니까?</p>
      </Modal>

    </div >
  );
};

PostCard.propTypes = { post: PropTypes.object.isRequired };

export default PostCard;