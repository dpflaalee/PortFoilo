import React from "react";
import { useRouter } from "next/router";
import AppLayout from "@/components/AppLayout";
import {
  Avatar,
  Typography,
  Button,
  Card,
  Row,
  Col,
  Calendar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const MyPrize = () => {
  const router = useRouter();

  // category 인자를 받아서 API 호출하는 함수로 변경
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

  // 오른쪽 메뉴 컴포넌트로 사용할 Calendar 구성
  const rightSidebar = (
    <Card title="챌린지 참여 현황" bordered={false}>
      <Calendar fullscreen={false} />
    </Card>
  );

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
          <Col>
            <Button type="primary" style={{ marginRight: 8 }}>내 쿠폰함</Button>
            <Button style={{ marginRight: 8 }}>내 장소</Button>
            <Button>챌린지 현황</Button>
          </Col>
        </Row>
      </Card>

      {/* 내 박스 */}
      <Card title="내 박스" style={{ marginBottom: 24 }}>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Card
              type="inner"
              title="강아지 랜덤박스"
              extra={<Button danger onClick={() => openRandomModal('dog')}>사용</Button>}
            >
              유효기간: 2025/05/30
            </Card>
          </Col>
          <Col span={24}>
            <Card
              type="inner"
              title="고양이 랜덤박스"
              extra={<Button danger onClick={() => openRandomModal('cat')}>사용</Button>}
            >
              유효기간: 2025/05/30
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 내 쿠폰함 */}
      <Card title="내 쿠폰함" style={{ marginBottom: 24 }}>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Card
              type="inner"
              title="쿠폰이름"
              extra={<Button type="primary">사용</Button>}
            >
              유효기간: 2025/05/30
            </Card>
          </Col>
          <Col span={24}>
            <Card
              type="inner"
              title="쿠폰이름"
              extra={<Button type="primary">사용</Button>}
            >
              유효기간: 2025/05/30
            </Card>
          </Col>
        </Row>
      </Card>
    </AppLayout>
  );
};

export default MyPrize;
