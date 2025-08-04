import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Avatar, Button, List, Popover, Modal, Input, Space, Select } from 'antd';
import { ConsoleSqlOutlined, EllipsisOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, RetweetOutlined } from '@ant-design/icons';
import PostImages from './PostImages';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/Link';
import { LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, REMOVE_POST_REQUEST, UPDATE_POST_REQUEST, RETWEET_REQUEST } from '@/reducers/post';
import ComplainForm from '../complains/ComplainForm';
import TARGET_TYPE from '../../../shared/constants/TARGET_TYPE';
import PostCardContent from './PostCardContent';

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

const KakaoMapIcon = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="20"
    height="20"
    style={{ marginRight: 8, verticalAlign: 'middle', ...style }}
  >
    <circle cx="256" cy="256" r="256" fill="#ffcd00" />
    <path
      d="M256 128c-70.7 0-128 49.4-128 110.4 0 38.6 25.5 72.3 63.5 92.4l-20 53.2c-1.6 4.2 3.1 8 7 5.8l70.5-38.6c1.7.1 3.5.2 5.3.2 70.7 0 128-49.4 128-110.4S326.7 128 256 128z"
      fill="#000"
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
  }, [post.id, dispatch]);
  
  const [newContent, setNewContent] = useState(post.content);
  const [newScope, setNewScope] = useState(post.scope || 'public');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { removePostLoading, removePostDone, retweetPost } = useSelector(state => state.post);
  const { mainComplainCard,mainPosts } = useSelector(state => state.complain);
  const [locationLink, setLocationLink] = useState(null);
  const {user} = useSelector(state => state.user);
  let filename = '';

  if(Number(post?.UserId) === Number(post.User?.UserProfileImages?.UserId)){
    filename = user?.UserProfileImages?.[0]?.src;
  }else{
    filename = post?.User?.UserProfileImages?.[0]?.src;
  }
  let retweetSender = '';
  let retweetReceiver = '';
  if(post.Retweet){
    retweetSender = post.Retweet.User.UserProfileImages?.[0]?.src;
    retweetReceiver = post.Retweet.User.UserProfileImages?.[0]?.src;
  }
  
  useEffect(() => {
    setNewContent(post.content);
    setNewScope(post.scope || 'public');
  }, [post]);

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
    if (newContent.trim() === post.content.trim() && newScope === (post.scope || 'public')) {
      return closeEditModal();
    }
    dispatch({
      type: UPDATE_POST_REQUEST,
      data: {
        PostId: post.id,
        content: newContent,
        openScope: newScope,
      }
    });
    setEditModalVisible(false);
  }, [newContent, newScope, post, dispatch]);

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
    console.log('리트윗버튼클릭',post.id);
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
      notiData: {
        SenderId: id, // 로그인한 유저의 아이디
        ReceiverId: post.User.id
      }
    });
  });

  // 신고 된 글 블라인드 처리
  const isBlinded = mainComplainCard.some((report) => Number(report.targetId) === Number(post.id) && report.isBlind && report.targetType === TARGET_TYPE.POST);
  const content = isBlinded ? '신고된 게시글입니다.' : post.content;

  // 리트윗된 글이 신고될 경우 블라인드 처리
  let retweetImage = post.User.UserProfileImages?.[0]?.src;
  console.log('postpost', post);
  console.log('postpost', post.User.UserProfileImages?.[0]?.src);
  console.log('post.Retweet', post.Retweet);
  console.log('post.Retweet.User', post.Retweet?.User);
  console.log('retweetImage',retweetImage)
  console.log('mainComplainCard', mainComplainCard);
  console.log('retweetPost', retweetPost);
  const isBlindedRetweet = mainComplainCard.some((report) => Number(report.targetId) === Number(post.Retweet?.id) && report.isBlind && report.targetType === TARGET_TYPE.POST);

  const isBlockedOriginalPost = post.Retweet && (
    !post.Retweet.User ||
    post.Retweet.OpenScope?.type === 'private' ||
    post.Retweet.isBlocked // 서버에서 a가 b를 차단해서 true로 내려준다고 가정
  );


  return (
    <div style={{ margin: '3%' }}>
      {post.RetweetId ? (
        <Card
          style={{
            backgroundColor: '#f5f7fa',
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            padding: '12px',
            marginBottom: 24,
          }}
          bodyStyle={{ padding: 16 }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <Link href={`/user/myPage/${post.User.id}`} prefetch={false}>
                <Avatar style={{ marginRight: 8 }} src={(post.User?.id === post.User.UserProfileImages?.[0]?.UserId) ?`http://localhost:3065/userImages/${retweetImage}`:`http://localhost:3065/userImages/${retweetImage}`}>{post.User.nickname[0]}</Avatar>
              </Link>
              <span>{post.User.nickname}님이 리트윗했습니다.</span>
            </div>
          }
          actions={[
            like
              ? <span key="heart"><PawIcon filled={true} style={{ fontSize: '32px' }} onClick={onClickunLike} /> {post.Likers.length}</span>
              : <span key="heart"><PawIcon filled={false} style={{ fontSize: '32px' }} onClick={onClickLike} /> {post?.Likers?.length}</span>,
            <span key="comment">
              <Link href={`/post/${post.id}`} passHref>
                <MessageOutlined /> {post.Comments?.filter(c => !c.RecommentId && !Boolean(c.isDeleted)).length || 0}
              </Link>
            </span>,
            <Popover content={(
              <Button.Group>
                {id === post.User.id && (
                  <>
                    <Button onClick={openEditModal}>수정</Button>
                    <Button type="danger" onClick={openDeleteModal}>삭제</Button>
                  </>
                )}
                <Button onClick={() => setOpen(true)}>신고하기</Button>
              </Button.Group>
            )}>
              <EllipsisOutlined />
            </Popover>
          ]}
        >
          {isBlockedOriginalPost || isBlindedRetweet ? (
            <Card
              size="small"
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '12px',
                backgroundColor: '#ffffff',
                marginBottom: 24,
              }}
              bodyStyle={{ padding: 16 }}
            >
              <div style={{ textAlign: 'center', padding: 32, color: '#999' }}>
                비공개된 게시물입니다.
              </div>
            </Card>
          ) : (
            <Card
              size="small"
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '12px',
                backgroundColor: '#ffffff',
                marginBottom: 24,
              }}
              bodyStyle={{ padding: 16 }}
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link href={`/user/myPage/${post.User?.id}`} prefetch={false}>
                      <Avatar style={{ marginRight: 8 }} src={(post.User?.id === post.User.UserProfileImages?.[0]?.UserId) ?`http://localhost:3065/userImages/${retweetReceiver}`:`http://localhost:3065/userImages/${retweetReceiver}`}>{post.Retweet.User.nickname[0]} </Avatar>
                    </Link>
                    <span>{post.Retweet.User.nickname}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {post.Categorys?.map((category) => (
                      <span
                        key={category.id}
                        style={{
                          backgroundColor: !category.isAnimal ? '#ffcc00' : '#f0f0f0',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: 12,
                          color: '#555',
                        }}
                      >
                        {category.content}
                      </span>
                    ))}
                  </div>
                </div>
              }
            >
              <Link href={`/post/${post.id}`} legacyBehavior>
                <a style={{ textDecoration: 'none', color: 'inherit' }}>
                  <PostCardContent
                    editMode={false}
                    postData={post.Retweet.content}
                    onEditPost={() => { }}
                    onCancelUpdate={() => { }}
                    setLocationLink={setLocationLink}
                  />
                </a>
              </Link>


              {
                post.Retweet.Images?.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                    <PostImages images={post.Retweet.Images} />
                  </div>
                )
              }


              {locationLink && (
                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <Button
                    onClick={() => window.open(locationLink, '_blank')}
                    style={{ border: '1px solid #eee', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <KakaoMapIcon />
                    카카오맵에서 보기
                  </Button>
                </div>
              )}
            </Card>
          )}
        </Card>
      ) : (
        // 일반 게시글
        <Card
          style={{
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            padding: '12px',
            backgroundColor: '#ffffff',
            marginBottom: 24,
          }}
          bodyStyle={{ padding: 16 }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link href={`/user/myPage/${post.User?.id}`} prefetch={false}>
                  <Avatar style={{ marginRight: 8 }} src={(post.User?.id === post.User.UserProfileImages.UserId) ?`http://localhost:3065/userImages/${filename}`:`http://localhost:3065/userImages/${filename}`}>{post.User?.nickname[0]}</Avatar>
                </Link>
                <span>{post.User?.nickname}</span>
              </div>

              <div style={{ display: 'flex', gap: 4 }}>
                {post.Categorys && post.Categorys.length > 0 ? (
                  post.Categorys.map((category) => (
                    <span
                      key={category.id}
                      style={{
                        backgroundColor: !category.isAnimal ? '#ffcc00' : '#f0f0f0',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: 12,
                        color: '#555',
                      }}
                    >
                      {category.content}
                    </span>
                  ))
                ) : null}
              </div>
            </div>
          }
          actions={[
            <RetweetOutlined key="retweet" onClick={onRetweet} />,
            like
              ? <span key="heart"><PawIcon filled={true} style={{ fontSize: '32px' }} onClick={onClickunLike} /> {post.Likers.length}</span>
              : <span key="heart"><PawIcon filled={false} style={{ fontSize: '32px' }} onClick={onClickLike} /> {post?.Likers?.length}</span>,
            <span key="comment">
              <Link href={`/post/${post.id}`} passHref>
                <MessageOutlined /> {post.Comments?.filter(c => !c.RecommentId && !Boolean(c.isDeleted)).length || 0}
              </Link>
            </span>,
            <Popover content={(
              <Button.Group>
                {id === post.User.id && (
                  <>
                    <Button onClick={openEditModal}>수정</Button>
                    <Button type="danger" onClick={openDeleteModal}>삭제</Button>
                  </>
                )}
                <Button onClick={() => setOpen(true)}>신고하기</Button>
              </Button.Group>
            )}>
              <EllipsisOutlined />
            </Popover>
          ]}
        // extra={<>{id && id !== post.User.id && <FollowButton post={post} />}</>}  
        >
          <Link href={`/post/${post.id}`} legacyBehavior>
            <a style={{ textDecoration: 'none', color: 'inherit' }}>
              <PostCardContent
                editMode={editMode}
                onEditPost={onEditPost}
                onCancelUpdate={onCancelUpdate}
                postData={content}
                setLocationLink={setLocationLink}
              />
            </a>
          </Link>

          {!isBlinded && post.Images && post.Images.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <PostImages images={post.Images} />
            </div>
          )}

          {locationLink && (
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <Button
                onClick={() => window.open(locationLink, '_blank')}
                style={{ border: '1px solid #eee', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <KakaoMapIcon />
                카카오맵에서 보기
              </Button>
            </div>
          )}

          {open && (
            <ComplainForm
              open={open}
              targetId={post.Retweet ? post.Retweet.id : post.id}
              TARGET_TYPE={TARGET_TYPE.POST}
              targetUserNickname={post.User?.nickname}
              onClose={() => setOpen(false)}
            />
          )}
        </Card>
      )}

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
            <Select
              value={newScope}
              style={{ width: 120 }}
              onChange={(value) => setNewScope(value)}
            >
              <Option value="public">전체 공개</Option>
              <Option value="private">나만 보기</Option>
              <Option value="follower">팔로워 공개</Option>
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
