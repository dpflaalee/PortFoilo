import React, { useState, useEffect, useCallback } from 'react';
import { Card, Avatar, Button, Popover, Modal, Input, Space, Select } from 'antd';
import { EllipsisOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, RetweetOutlined, CloseOutlined, } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, REMOVE_POST_REQUEST, UPDATE_POST_REQUEST, RETWEET_REQUEST } from '@/reducers/post';
import Link from 'next/Link';

import PostImages from '../post/PostImages';
import { useRouter } from 'next/router';
import CommentForm from '../comment/CommentForm';
import Comment from '../comment/Comment';
import PostCardContent from '../post/PostCardContent';
import ComplainForm from '../complains/ComplainForm';

import { ADD_NOTIFICATION_REQUEST } from '@/reducers/notification'
import NOTIFICATION_TYPE from '../../../shared/constants/NOTIFICATION_TYPE';
import TARGET_TYPE from '../../../shared/constants/TARGET_TYPE';
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

const DetailCard = ({ post, onRefreshPost }) => {
  const id = useSelector((state) => state.user.user?.id);
  const dispatch = useDispatch();
  const router = useRouter();
  const { Option } = Select;
  const [newContent, setNewContent] = useState(post.content);
  const [newScope, setNewScope] = useState(post.scope || 'public');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const { updatePostDone } = useSelector((state) => state.post);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { removePostDone } = useSelector((state) => state.post);
  const [localComments, setLocalComments] = useState(post.Comments || []);
  const [open, setOpen] = useState(false);
  const [locationLink, setLocationLink] = useState(null);

  useEffect(() => {
    setNewContent(post.content);
    setNewScope(post.scope || 'public');
  }, [post]);

  useEffect(() => {
    if (updatePostDone) {
      onRefreshPost();
      setEditModalVisible(false);
    }
  }, [updatePostDone, onRefreshPost]);

  useEffect(() => {
    setLocalComments(post.Comments || []);
  }, [post.Comments]);
  
  const onClickLike = useCallback(() => {
    if (!id) { return alert('로그인을 하시면 좋아요 추가가 가능합니다.'); }
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
      callback: () => onRefreshPost(),
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
  }, [id, post.id, dispatch, onRefreshPost]);

  const onClickunLike = useCallback(() => {
    if (!id) return alert('로그인을 하시면 좋아요 취소가 가능합니다.');

    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
      callback: () => onRefreshPost(),
    });
  }, [id, post.id, dispatch, onRefreshPost]);

  const like = post?.Likers?.some((liker) => liker.id === id);

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
      },
      callback: () => {
        // 수정 완료 후 후속 작업 (API 응답을 받은 후 상태 갱신)
        onRefreshPost();  // 새로운 데이터 반영
      },
    });
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
    setDeleteModalVisible(false);
    router.push('/main');
  }, [dispatch, post.id, router]);

  const [editMode, setEditMode] = useState(false);
  const onClickUpdate = useCallback(() => { setEditMode(true); }, []);
  const onCancelUpdate = useCallback(() => { setEditMode(false); }, []);
  const onEditPost = useCallback((editText) => () => {
    dispatch({
      type: UPDATE_POST_REQUEST,
      data: { PostId: post.id, content: editText }
    });
  }, [post.id, dispatch]);
  const onRetweet = useCallback(() => {
    if (!id) { return alert('로그인 후 리트윗이 가능합니다.'); }
    dispatch({
      type: RETWEET_REQUEST,
      data: post.id
    });
    router.push('/main');
  },[dispatch, post.id, router]);

  /// 신고 처리된 댓글 , 게시글 블라인드 처리
  const { mainComplainCard } = useSelector(state => state.complain);
  const isBlinded = mainComplainCard?.some((report) => report.targetId === post.id && report.isBlind);
  const content = isBlinded ? '신고된 게시글입니다.' : post.content;
  const processedComments = post.Comments.map(comment => {
    const isCommentBlind = mainComplainCard?.some((report) => report.targetId === comment.id && report.isBlind && report.targetType === TARGET_TYPE.COMMENT);
    const processedRecomments = comment.Recomments?.map(recomment => {
      const isRecommentBlind = mainComplainCard?.some((report) => report.targetId === recomment.id && report.isBlind && report.targetType === TARGET_TYPE.COMMENT);
      return {
        ...recomment,
        content: isRecommentBlind ? '신고된 댓글입니다.' : recomment.content,
      };
    }) || [];

    return {
      ...comment,
      content: isCommentBlind ? '신고된 댓글입니다.' : comment.content,
      Recomments: processedRecomments,
    };
  });

  return (
    <div style={{ margin: '3%' }}>
      {post.RetweetId && post.Retweet ? (
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
                <Avatar style={{ marginRight: 8 }}>{post.User.nickname[0]}</Avatar>
              </Link>
              <span>{post.User.nickname}님이 리트윗한 게시물입니다.</span>
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
          extra={
            <CloseOutlined
              style={{ fontSize: 20, color: 'gray', cursor: 'pointer' }}
              onClick={() => router.push('/main')}
            />
          }
        >
          {/* 내부에 리트윗된 게시물 카드 */}
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
                    <Avatar style={{ marginRight: 8 }}>{post.Retweet?.User?.nickname[0]}</Avatar>
                  </Link>
                  <span>{post.Retweet?.User?.nickname}</span>
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
          >
            <div
              onClick={() => router.push(`/post/${post.RetweetId}`)}
              style={{ cursor: 'pointer' }}
            >
            <PostCardContent
              editMode={false} // 리트윗 원본은 수정 불가
              postData={post.Retweet.content}
              setLocationLink={setLocationLink}
            />
            </div>
            {post.Retweet.Images && post.Retweet.Images.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <PostImages images={post.Retweet.Images} />
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

          </Card>
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
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link href={`/user/myPage/${post.User?.id}`} prefetch={false}>
                  <Avatar style={{ marginRight: 8 }}>{post.User?.nickname[0]}</Avatar>
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
          extra={
            <CloseOutlined
              style={{ fontSize: 20, color: 'gray', cursor: 'pointer', marginLeft: 12 }}
              onClick={() => router.push('/main')}
            />
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
            </Popover>
          ]}
        // extra={<>{id && id !== post.User.id && <FollowButton post={post} />}</>}  
        >

          <PostCardContent
            editMode={editMode}
            onEditPost={onEditPost}
            onCancelUpdate={onCancelUpdate}
            postData={content}
            setLocationLink={setLocationLink}
          />

          {post.Images && post.Images.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
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

        </Card>
      )}

      <CommentForm post={post} onAddLocalComment={onRefreshPost} />
      <Comment comments={processedComments} id={`comment-${processedComments.id}`} postId={post.id} post={post} onRefreshPost={onRefreshPost} />

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
    </div>
  );
};

export default DetailCard;