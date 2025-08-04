import React from 'react';
import { Menu, Row, Col } from 'antd';
import Nav from './Nav';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ContentHeader from './ContentHeader';
import Calendar from './Calendar/Calendar-ssen';
import Todolists from './Calendar/Todolist/Todolists';

const AppLayoutWrapper = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
`;

const ColWithOrder = styled(Col)`
  &.nav-col { order: 10; } /* 모바일에서 하단 */ 
  &.main-col { order: 1; }
  &.right-col { order: 2; }

  @media (min-width: 768px) {
    &.nav-col { order: 1; }
    &.main-col { order: 2; }
    &.right-col {  order: 3; }
  }
`;

const AppLayout = ({ children, group, members }) => {

  return (

    <>
      <AppLayoutWrapper>
        <Menu mode="horizontal" />

        <Row gutter={[16, 16]}>
          {/* Navigation */}
          {/* 애매한 공백 삭제용 padding 추가됨 */}
          <ColWithOrder xs={24} md={4} className="nav-col" style={{ paddingRight: "0", borderRight: "3px solid #eee" }}>
            <Nav />
          </ColWithOrder>

          {/* Main Content */}
          <ColWithOrder xs={24} md={15} className="main-col" style={{ padding: "0", borderRight: "3px solid #eee" }}>
            {/* 메인컨텐츠 상단고정영역추가 */}
            <ContentHeader  group={group} members={members} />
            {children}
          </ColWithOrder>

          {/* Right Sidebar */}
          <ColWithOrder xs={0} md={5} className="right-col" style={{ padding: "0" }}>
            <Todolists />
            {/* <Calendar /> */}
          </ColWithOrder>

        </Row>
      </AppLayoutWrapper>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;