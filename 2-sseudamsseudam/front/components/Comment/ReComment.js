import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Avatar, Dropdown, Menu, Button, List } from 'antd';
import { MoreOutlined, MessageOutlined } from '@ant-design/icons';

import ComplainForm from '../complains/ComplainForm';
import TARGET_TYPE from '../../../shared/constants/TARGET_TYPE';
import { REMOVE_COMMENT_REQUEST } from '../../reducers/post';
import ReCommentForm from './ReCommentForm';

const Wrapper = styled.div`
  margin-top: 24px;
`;

const CommentItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
`;

const Left = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const NicknameDateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Nickname = styled.div`
  font-weight: 600;
  color: #333;
`;

const CommentDate = styled.div`
  font-size: 12px;
  color: #999;
`;

const Text = styled.div`
  color: #555;
  white-space: pre-wrap;
  line-height: 1.4;
`;

const ReComment = ({ comments = [], postId, post = {} }) => {
  const dispatch = useDispatch();
  const [targetId, setTargetId] = useState(null);
  const [openReport, setOpenReport] = useState(false);

  // 대댓글 리스트 열림 상태를 댓글 ID별로 관리
  const [openReplies, setOpenReplies] = useState({});

  const handleReport = (commentId) => {
    setTargetId(commentId);
    setOpenReport(true);
  };

  const toggleReplies = useCallback((commentId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }, []);

  // 대댓글만 필터링 (부모 댓글의 자식 댓글들)
  const childComments = comments.filter((comment) => comment.RecommentId);

  // 댓글 삭제
  const onRemoveComment = useCallback((commentId) => {
    if (!postId) {
      return alert('게시글 정보가 없습니다.');
    }
    dispatch({
      type: REMOVE_COMMENT_REQUEST,
      data: { postId, commentId },
    });
    window.location.reload();
  }, [postId, dispatch]);

  ////////////////////////////////
  // 신고된 대댓글 블라인드 처리
  const mainComplainCard = useSelector(state => state.complain.mainComplainCard);
  const processRecomments = (recomments = []) =>
    recomments.map(recomment => {
      const isBlind = mainComplainCard?.some(report => report.targetId === recomment.id && report.isBlind);
      return {
        ...recomment,
        content: isBlind ? '신고된 댓글입니다.' : recomment.content,
      };
    });


  ///////////////////////////////
  return (
    <Wrapper>
      <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>
        대댓글 {childComments.length}개
      </div>
      {childComments.length === 0 && <div>대댓글이 없습니다.</div>}

      {processRecomments.map((comment) => {
        const createdAt = comment.createdAt ? new Date(comment.createdAt).toLocaleString() : '';

        const menu = (
          <Menu>
            <Menu.Item>수정</Menu.Item>
            <Menu.Item danger onClick={() => onRemoveComment(comment.id)}>삭제</Menu.Item>
            <Menu.Item danger onClick={() => handleReport(comment.id)}>신고하기</Menu.Item>
            <ComplainForm
              open={openReport}
              onClose={() => setOpenReport(false)}
              TARGET_TYPE={TARGET_TYPE.COMMENT}
              targetId={targetId}
              targetUserNickname={comment.User?.nickname}
            />
          </Menu>
        );

        return (
          <CommentItem key={comment.id}>
            <Left>
              <Avatar>{comment.User?.nickname?.[0] || 'U'}</Avatar>
              <Content>
                <NicknameDateWrapper>
                  <Nickname>{comment.User?.nickname || '알 수 없음'}</Nickname>
                  {createdAt && <CommentDate>{createdAt}</CommentDate>}
                </NicknameDateWrapper>
                <Text>{comment.content}</Text>
                <MessageOutlined
                  style={{ marginTop: '12px', cursor: 'pointer' }}
                  onClick={() => toggleReplies(comment.id)}
                />
              </Content>
            </Left>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>

            {/* 대댓글 폼과 리스트 토글로 보여주기 */}
            {
              openReplies[comment] && (
                <>
                  <ReCommentForm post={post} parentCommentId={comment.id} parentCommentUserId={comment.User.id} />
                  {comment.Recomments && comment.Recomments.length > 0 && (
                    <div style={{ marginLeft: 40 }}>
                      {comment.Recomments.map((recomment) => (
                        <CommentItem key={recomment.id}>
                          <Left>
                            <Avatar>{recomment.User?.nickname?.[0] || 'U'}</Avatar>
                            <Content>
                              <NicknameDateWrapper>
                                <Nickname>{recomment.User?.nickname || '알 수 없음'}</Nickname>
                                <CommentDate>
                                  {recomment.createdAt && new Date(recomment.createdAt).toLocaleString()}
                                </CommentDate>
                              </NicknameDateWrapper>
                              <Text>{recomment.content}</Text>
                            </Content>
                          </Left>
                        </CommentItem>
                      ) )}
                    </div>
                  )}
                </>
              )}
          </CommentItem>
        );
      })}
    </Wrapper>
  );
};

export default ReComment;
