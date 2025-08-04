import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Button, Avatar } from 'antd';
import Link from 'next/Link';
import PostCard from '../post/PostCard';
import Profile from '../user/Profile';
import SearchResultGroup from './SearchResultGroupList';
import SearchUserList from './SearchUserList';

const Container = styled.div`
  padding: 20px;
  width: 100%;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
  justify-content: center;
  gap: 16px;
  font-weight: bold;
`;

const Tab = styled.div`
  cursor: pointer;
  border-bottom: ${({ active }) => (active ? '2px solid black' : 'none')};
  margin-left: 5%;
  margin-right: 5%;
`;

const MemberCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #ddd;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchResult = ({ results }) => {
  const [activeTab, setActiveTab] = useState('post');
  const currentList = results[activeTab] || [];

  return (
    <Container>
      <TabsContainer>
        <Tab active={activeTab === 'post'} onClick={() => setActiveTab('post')}><h3>게시글</h3></Tab>
        <Tab active={activeTab === 'group'} onClick={() => setActiveTab('group')}><h3>그룹</h3></Tab>
        <Tab active={activeTab === 'member'} onClick={() => setActiveTab('member')}><h3>멤버</h3></Tab>
      </TabsContainer>

      {currentList.length === 0 ? (
        <div>🔍 검색 결과가 없습니다.</div>
      ) : (
        currentList.map((item) => (
          <div key={item.id}>
            {activeTab === 'post' && <PostCard post={item} />}
            {activeTab === 'group' && <SearchResultGroup g={item} />}
            {activeTab === 'member' && <SearchUserList user={item} />}
          </div>
        ))
      )}
    </Container>
  );
};

export default SearchResult;
