import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Avatar, Button, Input, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import userInput from '@/hooks/userInput';
import { ADD_COMMENT_REQUEST } from '../../reducers/post';

const Wrapper = styled.div`
  padding: 24px 16px;
  border-top: 1px solid #eee;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
`;

const AvatarWrapper = styled.div`
  flex-shrink: 0;
`;

const ContentArea = styled.div`
  flex: 1;
`;

const StyledForm = styled(Form)`
  position: relative;
`;

const StyledTextArea = styled(Input.TextArea)`
  border-radius: 8px;
  padding: 12px;
  resize: none;
  font-size: 14px;
`;

const SubmitButton = styled(Button)`
  position: absolute;
  right: 0;
  bottom: -44px;
  border-radius: 8px;
  background-color: #2f466c;
  color: white;
  padding: 4px 16px;
`;

const ReCommentForm = ({ post, parentCommentId, onAddLocalComment, parentCommentUserId }) => {
  const { addCommentLoading, addCommentDone } = useSelector((state) => state.post);
  const id = useSelector((state) => state.user.user?.id);
  const nickname = useSelector((state) => state.user.user?.nickname);
  const dispatch = useDispatch();
  const [comment, onChangeComment, setComment] = userInput('');

  useEffect(() => {
    if (addCommentDone && onAddLocalComment) {
      onAddLocalComment(); // 부모 컴포넌트의 fetchPost 호출
    }
  }, [addCommentDone, onAddLocalComment]);

  useEffect(() => {
    if (addCommentDone && onAddLocalComment) {
      onAddLocalComment();
      setComment('');
    }
  }, [addCommentDone, onAddLocalComment, setComment]);

  const onSubmitForm = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    if (!comment.trim()) {
      return alert('댓글을 입력하세요.');
    }
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: comment, userId: id, postId: post.id, RecommentId: parentCommentId, CommentUserId: parentCommentUserId },
      postAuthorId: post.User.id,
      isReComment: true,
    });
  }, [comment, id, post.id, dispatch]);

  return (
    <Wrapper>
      <FormRow>
        <AvatarWrapper>
          <Avatar>{nickname ? nickname[0] : '?'}</Avatar>
        </AvatarWrapper>
        <ContentArea>
          <StyledForm onFinish={onSubmitForm}>
            <StyledTextArea
              rows={4}
              placeholder="댓글을 입력하세요."
              value={comment}
              onChange={onChangeComment}
            />
            <SubmitButton htmlType="submit" loading={addCommentLoading}>
              댓글
            </SubmitButton>
          </StyledForm>
        </ContentArea>
      </FormRow>
    </Wrapper>
  );
};

ReCommentForm.propTypes = {
  post: PropTypes.object.isRequired,
  onAddLocalComment: PropTypes.func,
  parentCommentUserId: PropTypes.number.isRequired,
};

export default ReCommentForm;
