//components/checklist/ChecklistLayout
import { Layout, Menu } from 'antd';
import Sidebar from '../mypage/Sidebar';

const { Sider, Content } = Layout;

const ChecklistLayout = ({ children, isAdmin }) => {
  const menuItems = isAdmin ? [
    { key: '1', label: '체크리스트 관리' },
    { key: '2', label: '신고 관리' },
  ] : [
    { key: '1', label: '예약 내역 보기' },
    { key: '2', label: '내 체크리스트' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Content style={{ padding: '24px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChecklistLayout;
