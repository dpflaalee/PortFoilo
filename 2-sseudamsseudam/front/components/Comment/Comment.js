import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Avatar, Dropdown, Menu, Button, List } from 'antd';
import { MoreOutlined, MessageOutlined } from '@ant-design/icons';
import router from 'next/router';

import ComplainForm from '../complains/ComplainForm';
import TARGET_TYPE from '../../../shared/constants/TARGET_TYPE';
import { REMOVE_COMMENT_REQUEST, UPDATE_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST } from '../../reducers/post';
import ReCommentForm from './ReCommentForm';
import ReComment from './ReComment';
import { LOAD_COMPLAIN_REQUEST } from '@/reducers/complain';
import { LOAD_USER_REQUEST } from '@/reducers/user';

const Wrapper = styled.div`
  margin-top: 24px;
`;

const CommentItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
`;

const Left = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
`;

const AvatarStyled = styled(Avatar)`
  background-color: #87d068;
  font-weight: 700;
  font-size: 18px;
  user-select: none;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const NicknameDateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
`;

const Nickname = styled.div`
  font-weight: 700;
  color: #222;
`;

const CommentDate = styled.div`
  font-size: 12px;
  color: #999;
`;

const Text = styled.div`
  color: #444;
  white-space: pre-wrap;
  line-height: 1.5;
  font-size: 15px;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  resize: none;
  border-radius: 6px;
  border: 1px solid #ddd;
  padding: 10px;
  font-size: 14px;
  font-family: inherit;
  margin-bottom: 8px;

  &:focus {
    outline: none;
    border-color: #40a9ff;
    box-shadow: 0 0 5px #40a9ff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const MessageIconStyled = styled(MessageOutlined)`
  margin-top: 14px;
  font-size: 20px;
  color: #888;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #40a9ff;
  }
`;

const ReplyWrapper = styled.div`
  margin-left: 48px;
  margin-top: 8px;
`;

const RecommentNicknameDate = styled(NicknameDateWrapper)`
  gap: 6px;
  margin-bottom: 3px;
`;

const RecommentNickname = styled(Nickname)`
  font-weight: 600;
  font-size: 14px;
`;

const RecommentDate = styled(CommentDate)`
  font-size: 11px;
`;

const RecommentText = styled(Text)`
  font-size: 14px;
  color: #555;
`;

const Comment = ({ comments = [], postId, post = {}, onRefreshPost }) => {
  const dispatch = useDispatch();
  const [targetId, setTargetId] = useState(null);
  const [openReport, setOpenReport] = useState(false);
  const parentComments = comments.filter(comment => !comment.RecommentId && !comment.isDeleted);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingRecommentId, setEditingRecommentId] = useState(null);
  const [editRecommentContent, setEditRecommentContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const { updateCommentLoading, updateCommentDone, removeCommentLoading, removeCommentDone } = useSelector((state) => state.post);
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  const handleReport = (commentId) => {
    setTargetId(commentId);
    setOpenReport(true);
  };

  const [replyTargetId, setReplyTargetId] = useState(null);

  const onClickReply = useCallback((commentId) => {
    setReplyTargetId((prev) => (prev === commentId ? null : commentId));
  }, []);

  useEffect(() => {
    if (!user) {
      dispatch({
        type: LOAD_USER_REQUEST,
      });
    }
  }, [dispatch, user]);

  //댓글 수정
  const onClickEdit = useCallback((comment) => {
    if (editingCommentId === comment.id) {
      setEditingCommentId(null);
      setEditContent('');
    } else {
      setEditingCommentId(comment.id);
      setEditContent(comment.content);
    }
  }, [editingCommentId]);

  const onChangeEditContent = useCallback((e) => {
    setEditContent(e.target.value);
  }, []);

  const onSaveEdit = useCallback(() => {
    if (!editContent.trim()) {
      return alert('댓글 내용을 입력하세요.');
    }
    dispatch({
      type: UPDATE_COMMENT_REQUEST,
      data: {
        postId,
        commentId: editingCommentId,
        content: editContent,
      },
      callback: () => {
        onRefreshPost?.();  // 수정 성공 후 최신화 콜백 호출
      },
    });
    setEditingCommentId(null);
    setEditContent('');
  }, [dispatch, editContent, editingCommentId, postId, onRefreshPost]);

  //댓글 삭제
  const onRemoveComment = useCallback((commentId) => {
    if (!postId) {
      return alert('게시글 정보가 없습니다.');
    }
    dispatch({
      type: REMOVE_COMMENT_REQUEST,
      data: { postId, commentId },
      callback: () => {
        onRefreshPost?.();  // 삭제 성공 후 최신화 콜백 호출
      },
    });
  }, [postId, dispatch, onRefreshPost]);

  //대댓글 수정
  const onClickEditRecomment = useCallback((recomment) => {
    if (editingRecommentId === recomment.id) {
      setEditingRecommentId(null);
      setEditRecommentContent('');
    } else {
      setEditingRecommentId(recomment.id);
      setEditRecommentContent(recomment.content);
    }
  }, [editingRecommentId]);  

  const onChangeEditRecommentContent = useCallback((e) => {
    setEditRecommentContent(e.target.value);
  }, []);  

  const onSaveEditRecomment = useCallback(() => {
    if (!editRecommentContent.trim()) {
      return alert('댓글 내용을 입력하세요.');
    }
    dispatch({
      type: UPDATE_COMMENT_REQUEST,
      data: {
        postId,
        commentId: editingRecommentId,
        content: editRecommentContent,
        isRecomment: true,
      },
      callback: () => {
        onRefreshPost?.();
      },
    });
    setEditingRecommentId(null);
    setEditRecommentContent('');
  }, [dispatch, editRecommentContent, editingRecommentId, postId, onRefreshPost]);

  // 신고 댓글 블라인드 처리
  const mainComplainCard = useSelector(state => state.complain.mainComplainCard);
  const processedParentComments = comments
    .filter(comment => !comment.RecommentId)
    .map(comment => {
      const isBlind = mainComplainCard?.some(report => report.targetType === TARGET_TYPE.COMMENT && Number(report.targetId) === Number(comment.id) && report.isBlind);
      return {
        ...comment,
        content: isBlind ? '신고된 댓글입니다.' : comment.content,
      };
    })
    // 최신 댓글이 위로 오도록 내림차순 정렬
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 신고 당한 유저 닉네임 처리
  useEffect(() => {
    dispatch({
      type: LOAD_COMPLAIN_REQUEST,
    });
  }, [dispatch]);
  
  return (
    <Wrapper>
      <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>
        댓글 {parentComments.length}개
      </div>
      {comments.length === 0 && <div>댓글이 없습니다.</div>}
      {processedParentComments.map((comment) => {
        const createdAt = comment.createdAt
          ? new Date(comment.createdAt).toLocaleString()
          : '';

        const isAuthor = user?.id && Number(user.id) === Number(comment.User?.id);  

        const isBlindedUser = mainComplainCard.some((report) => {
          console.log(report);
          return Number(report.targetId) === Number(comment.User?.id) && report.isBlind && report.targetType === TARGET_TYPE.USER;
        });

        const isDeleted = comment.isDeleted;

        const displayContent = isDeleted ? '삭제된 댓글입니다.' : comment.content;
        const displayNickname = isDeleted ? '알 수 없음' : (isBlindedUser ? '신고된 유저입니다' : comment.User?.nickname || '알 수 없음');
        const displayAvatar = isDeleted
        ? 'U'
        : isBlindedUser
          ? 'X'
          : (comment.User?.nickname ? comment.User.nickname[0] : 'U');

        const menu = (
          <Menu>
            {isAuthor && !isDeleted && (
              <>
                <Menu.Item onClick={() => onClickEdit(comment)} loading={updateCommentLoading}>
                  {editingCommentId === comment.id ? '수정 취소' : '수정'}
                </Menu.Item>
                <Menu.Item danger onClick={() => onRemoveComment(comment.id)}>삭제</Menu.Item>
              </>
            )}
            {!isDeleted && (
              <Menu.Item danger onClick={() => handleReport(comment.id)}>
                신고하기
              </Menu.Item>
            )}
            {!isDeleted && (
              <ComplainForm
                open={openReport}
                onClose={() => setOpenReport(false)}
                TARGET_TYPE={TARGET_TYPE.COMMENT}
                targetId={targetId}
                targetUserNickname={comment.User?.nickname}
              />
            )}
          </Menu>
        );

        return (
          <div key={comment.id}>
            <CommentItem>
              <Left>
                <AvatarStyled>{displayAvatar}</AvatarStyled>
                <Content>
                <NicknameDateWrapper>
                  <Nickname>{displayNickname}</Nickname>
                  {createdAt && <CommentDate>{createdAt}</CommentDate>}
                </NicknameDateWrapper>

                  {editingCommentId === comment.id ? (
                    <>
                      <EditTextarea
                        value={editContent}
                        onChange={onChangeEditContent}
                        rows={3}
                      />
                      <ButtonGroup>
                        <Button type="primary" onClick={onSaveEdit}>
                          저장
                        </Button>
                        <Button onClick={() => setEditingCommentId(null)}>취소</Button>
                      </ButtonGroup>
                    </>
                  ) : (
                    <Text>{displayContent}</Text>
                  )}

                  <MessageIconStyled onClick={() => onClickReply(comment.id)} />
                </Content>
              </Left>
                {!isDeleted && (
                  <Dropdown overlay={menu} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                )}
            </CommentItem>

            {/* 대댓글 폼 */}
            {replyTargetId === comment.id && !comment.isDeleted && (
              <ReCommentForm
                post={post}
                parentCommentId={comment.id}  // 여기가 핵심! 대댓글 대상 댓글 ID 전달
                parentCommentUserId={comment.User?.id}
                onAddLocalComment={() => {
                  // 댓글 재요청 함수 등 있으면 여기에 호출
                }}
              />
            )}

            {/* 대댓글 리스트 */}
            {replyTargetId === comment.id && comment.Recomments && comment.Recomments.length > 0 && (
              <ReplyWrapper>
                <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                  대댓글 {comment.Recomments.length}개
                </div>
                {comment.Recomments.length === 0 && <div>대댓글이 없습니다.</div>}
                {comment.Recomments
                .slice() // 원본 배열 직접 변경 방지용 복사
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신순 정렬                
                .map((recomment) => {
                const reCreatedAt = recomment.createdAt ? new Date(recomment.createdAt).toLocaleString() : '';
                const isRecommentAuthor = user?.id && Number(user.id) === Number(recomment.User?.id);
                const isDeleted = recomment.isDeleted;

                const displayContent = isDeleted ? '삭제된 댓글입니다.' : recomment.content;
                const displayNickname = isDeleted ? '알 수 없음' : (isBlindedUser ? '신고된 유저입니다' : recomment.User?.nickname || '알 수 없음');
                const displayAvatarRecomment = isDeleted
                  ? 'U'
                  : isBlindedUser
                    ? 'X'
                    : (recomment.User?.nickname ? recomment.User.nickname[0] : 'U');

                // 대댓글 메뉴 정의
                const recommentMenu = (
                  <Menu>
                    {isRecommentAuthor && !isDeleted && (
                      <>
                        <Menu.Item onClick={() => onClickEditRecomment(recomment)}>
                          {editingRecommentId === recomment.id ? '수정 취소' : '수정'}
                        </Menu.Item>
                        <Menu.Item danger onClick={() => onRemoveComment(recomment.id)}>삭제</Menu.Item>
                      </>
                    )}
                    {!isDeleted && (
                      <Menu.Item danger onClick={() => handleReport(recomment.id)}>신고하기</Menu.Item>
                    )}
                    {!isDeleted && (
                      <ComplainForm
                        open={openReport && targetId === recomment.id}
                        onClose={() => setOpenReport(false)}
                        TARGET_TYPE={TARGET_TYPE.COMMENT}
                        targetId={targetId}
                        targetUserNickname={recomment.User?.nickname}
                      />
                    )}
                  </Menu>
                );

                return (
                  <CommentItem key={recomment.id} style={{ padding: '10px 16px', marginBottom: '8px', background: '#f9f9f9', borderRadius: '6px' }}>
                    <Left>
                      <AvatarStyled>{displayAvatarRecomment}</AvatarStyled>
                      <Content>
                        <RecommentNicknameDate>
                          <RecommentNickname>{displayNickname}</RecommentNickname>
                          <RecommentDate>{reCreatedAt}</RecommentDate>
                        </RecommentNicknameDate>

                        {editingRecommentId === recomment.id ? (
                          <>
                            <EditTextarea
                              value={editRecommentContent}
                              onChange={onChangeEditRecommentContent}
                              rows={3}
                            />
                            <ButtonGroup>
                              <Button type="primary" onClick={onSaveEditRecomment}>저장</Button>
                              <Button onClick={() => setEditingRecommentId(null)}>취소</Button>
                            </ButtonGroup>
                          </>
                        ) : (
                          <RecommentText>{displayContent}</RecommentText>
                        )}
                      </Content>
                    </Left>
                      {!isDeleted && (
                        <Dropdown overlay={recommentMenu} trigger={['click']}>
                          <Button type="text" icon={<MoreOutlined />} />
                        </Dropdown>
                      )}
                  </CommentItem>
                );
              })}
              </ReplyWrapper>
            )}
          </div>
        );
      })}
    </Wrapper>
  );
};

export default Comment;
