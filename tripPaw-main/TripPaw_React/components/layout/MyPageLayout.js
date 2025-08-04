// components/mypage/MypageLayout.js
import React from "react"
import { Layout } from 'antd';
import dynamic from 'next/dynamic';
import ContentHeader from '../ContentHeader';

const Sidebar = dynamic(() => import('@/components/mypage/Sidebar'), { ssr: false });

const { Sider, Content } = Layout;

const MypageLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={240} style={{ background: '#fff', paddingTop: '80px' }}>
        <Sidebar />
      </Sider>
      <ContentHeader />
      <Content style={{ padding: '80px', paddingTop: '80px', background: '#fff' }}>
        {children}
      </Content>
    </Layout>
  );
};

export default MypageLayout;