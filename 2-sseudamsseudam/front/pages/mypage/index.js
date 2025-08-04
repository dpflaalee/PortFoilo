import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "@/components/AppLayout";
import {
  Avatar,
  Typography,
  Button,
  Card,
  Row,
  Col,
} from "antd";
import { UserOutlined, EllipsisOutlined } from "@ant-design/icons";
import MyPrize from "@/components/prize/MyPrize";
import { Dropdown, Menu } from "antd";

const { Title, Text } = Typography;

const Index = () => {
  const [activeSection, setActiveSection] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (router.query.showPrize === "true") {
      setActiveSection("prize");
    }
  }, [router.query]);

  const openRandomModal = async (category) => {
    try {
      const res = await fetch(`/api/open-random-box?category=${category.id}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error("서버 응답 실패");

      const data = await res.json();
      if (data.success) {
        router.push(`/mypage/RandomBoxResult?status=success&item=${encodeURIComponent(data.itemName)}`);
      } else {
        router.push("/mypage/RandomBoxResult?status=fail");
      }
    } catch (error) {
      router.push("/mypage/RandomBoxResult?status=fail");
    }
  };

  return (
    <AppLayout>
      {/* 상단 프로필 */}
      <Card style={{ background: '#e6f7ff', marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col span={18}>
            <Row align="middle" gutter={16}>
              <Col>
                <Avatar size={80} icon={<UserOutlined />} />
              </Col>
              <Col>
                <Title level={4}>사용자명</Title>
                <Text>30일 팔로잉 | 22 팔로워 | 123개 게시글</Text>
              </Col>
            </Row>
          </Col>
        </Row>
        <Col>
          <Row justify="end" align="middle" gutter={[8, 0]}>
            <Col>
              <Button type="primary" onClick={() => setActiveSection("prize")}>
                내 쿠폰함
              </Button>
            </Col>
            <Col>
              <Button onClick={() => setActiveSection("places")}>내 장소</Button>
            </Col>
            <Col>
              <Button onClick={() => setActiveSection("challenge")}>챌린지 현황</Button>
            </Col>
          </Row>
        </Col>
      </Card>

      {activeSection === "prize" && <MyPrize openRandomModal={openRandomModal} />}
    </AppLayout>
  );
};
////////////////////////////////////////////////////////
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  //1. cookie 설정
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) { axios.defaults.headers.Cookie = cookie; }

  //2. redux 액션
  context.store.dispatch({ type: LOAD_MY_INFO_REQUEST });
  context.store.dispatch({ type: LOAD_POSTS_REQUEST });
  context.store.dispatch({ type: LOAD_COMPLAIN_REQUEST });
  context.store.dispatch(END);

  await context.store.sagaTask.toPromise();

});
////////////////////////////////////////////////////////
export default Index;
