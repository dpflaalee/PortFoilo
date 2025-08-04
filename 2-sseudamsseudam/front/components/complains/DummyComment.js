import React, { useState } from 'react';
import styled from 'styled-components';
import { Avatar, Dropdown, Menu, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

import ComplainForm from './ComplainForm';
import TARGET_TYPE from '../../../shared/constants/TARGET_TYPE';
//// import 수정

const Wrapper = styled.div`
  margin-top: 24px;
`;

const CommentItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

const Left = styled.div`
  display: flex;
  gap: 12px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nickname = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const Text = styled.div`
  color: #333;
`;

const Date = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

const Divider = styled.div`
  border-top: 1px solid #eee;
  margin: 16px 0;
`;

const DummyComment = ({ comment }) => {
    return (
        <Wrapper>
            <CommentItem key={comment.id}>
                <Left>
                    <Avatar />
                    <Content>
                        <Nickname>{comment?.User?.nickname}</Nickname>
                        <Text>{comment.content}</Text>
                        <Date>{comment.createdAt}</Date>
                    </Content>
                </Left>
            </CommentItem>
        </Wrapper>
    );
};


export default DummyComment;
