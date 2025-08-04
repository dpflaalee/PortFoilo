import React, { useState, useCallback } from 'react';
import { Modal, Button as AntButton, Avatar, Input, Upload } from 'antd';
import { CloseOutlined, InboxOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { userInput } from '../../hooks/userInput';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_COMPLAIN_REQUEST } from '../../reducers/complain';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    padding: 24px;
  }
  .ant-modal-header {
    border-bottom: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0;
  gap: 10px;
`;

const ReasonInput = styled(Input.TextArea)`
  margin: 16px 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
`;

const BlackButton = styled(AntButton)`
   background-color: black;
   color: white;
   border: none;
   &:hover {
     background-color: #222;
     color: white;
   }
 `
const XButton = styled(AntButton)`
 
 `

const ComplainForm = ({ open, onClose, TARGET_TYPE, targetId, targetUserNickname }) => {
  const [content, setContent] = useState('');
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const onComplainSubmit = useCallback(() => {
    if (!content || !content.trim()) { return alert('게시글을 작성하세요.'); }
    dispatch({
      type: ADD_COMPLAIN_REQUEST,
      data: {
        targetType: TARGET_TYPE,
        targetId: targetId,
        reason: content,
        reporterId: user.user.id,
      }
    });
    onClose();
    alert('신고가 완료되었습니다.');
  }, [content, dispatch, user, onClose, TARGET_TYPE]);
  return (
    <StyledModal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
    >
      <Header>
        <h3>신고하기</h3>
        <XButton type="" icon={<CloseOutlined />} onClick={onClose} />
      </Header>

      <UserInfo>
        <Avatar size={48}>{targetUserNickname ? targetUserNickname[0] : '?'}</Avatar>
        <div>
          <div>{targetUserNickname}</div>
        </div>
      </UserInfo>
      <ReasonInput rows={4} placeholder="신고 사유를 작성해주세요" name='content' onChange={(e) => setContent(e.target.value)} />
      <Footer>
        <BlackButton
          htmlType='submit'
          type="primary"
          onClick={onComplainSubmit}
        >
          신고하기
        </BlackButton>
      </Footer>
    </StyledModal>
  );
};

export default ComplainForm;
