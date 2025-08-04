import React, { useState } from 'react';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import styled from 'styled-components';
import { MoreOutlined } from '@ant-design/icons';
import ComplainForm from './complains/ComplainForm';
import TARGET_TYPE from '../../shared/constants/TARGET_TYPE';
import Link from 'next/Link';
import { useSelector } from 'react-redux';
import Router from 'next/router';

const Wrapper = styled.div`
  width: 100%;
  background-color: #f0f2f5;
`;

const Banner = styled.div`
  height: 160px;
  background-color: skyblue;
  position: relative;
`;

const Container = styled.div`
  background-color: #fff;
  padding: 24px 16px 24px;
  border-radius: 12px 12px 0 0 ;
  margin: -60px auto 0;
  border-bottom : 2px solid #eee;
  // box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  // max-width: 600px;
  position: relative;
`;

const AvatarBox = styled.div`
  position: absolute;
  top: -40px;
  left: 24px;
  border: 4px solid white;
  border-radius: 50%;
  background-color: white;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  margin-left: 96px; /* Avatar 오른쪽 공간 확보 */
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nickname = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const Stats = styled.div`
  margin-top: 4px;
  color: #555;
`;

const ButtonRow = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end; 
  gap: 8px;
`;

const DropdownBox = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const ManageButtonRow = styled.div`
  margin-top: 16px;
  margin-left: 10%;
  margin-right: 10%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center
`;

const AdminProfile = ({ showManageButtons = false, onSectionChange, isComplain }) => {

  const me = useSelector(state => state.user.user);
  const mainPosts = useSelector(state => state.post);

  const [open, setOpen] = useState(false);
  //const userId = useSelector(state => state.user.user?.id);
  const userId = 1;
  const menu = (
    <Menu>
      <Menu.Item key="logout">로그아웃</Menu.Item>
      <Menu.Item key="complain"><Link href={'/admin/complain'}>신고 페이지로 가기</Link></Menu.Item>
      <Menu.Item key="manage"><Link href={'/admin/manage'}>관리 페이지로 가기</Link></Menu.Item>
    </Menu>
  );

  return (
    <Wrapper>
      <Banner />
      <Container>
        <AvatarBox>
          <Avatar size={80} src={me?.profileImage}>
            {me?.nickname[0]}
          </Avatar>
        </AvatarBox>

        <DropdownBox>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </DropdownBox>

        <TopRow >
          <InfoBox >
            <Nickname>{me.nickname}</Nickname>
            <Stats>
              {/* {me?.FollowingList?.length || 0} 팔로잉 &nbsp;&nbsp;
              {me?.FollowerList?.length || 0} 팔로워 &nbsp;&nbsp; */}
              {/* {mainPosts?.length || 0} 게시물 */}
            </Stats>
          </InfoBox>
        </TopRow>
        {showManageButtons ? (
          <ManageButtonRow>
            <Button size="small" onClick={() => Router.push('/admin/complain')}>신고 관리</Button>
            <Button size="small" onClick={() => onSectionChange('category')}>카테고리 관리</Button>
            <Button size="small" onClick={() => onSectionChange('schedule')}>일정 관리</Button>
            {/* <Button size="small" onClick={() => onSectionChange('challenge')}>챌린지 현황</Button> */}
            <Button size="small" type="primary" onClick={() => onSectionChange('prize')}>상품 관리</Button>
          </ManageButtonRow>
        )
          :
          (<ButtonRow>
            {!isComplain ?
              <Button ><Link href={'/admin/complain'}>신고 페이지로</Link></Button>
              :
              <Button ><Link href={'/admin'}>공지 페이지로</Link></Button>
            }
            <Button ><Link href={'/admin/manage'}>관리 페이지로</Link></Button>
            <Button type="primary"><Link href={'/main'}>공지 작성하기</Link></Button>
          </ButtonRow>)}
      </Container>
    </Wrapper>
  );
};

export default AdminProfile;
