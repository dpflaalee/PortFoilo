import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Modal, Button, Typography } from "antd";

const { Title, Text } = Typography;

const RandomBoxResult = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { status, item } = router.query;

  useEffect(() => {
    if (status) setVisible(true);
  }, [status]);

  const handleClose = () => {
    setVisible(false);
    router.push("/mypage?showPrize=true");
  };

  const decodedItem = item ? decodeURIComponent(item) : null;

  return (
    <Modal
      title={status === "success" ? "🎁 랜덤박스 결과" : "❌ 오류"}
      open={visible}
      onOk={handleClose}
      onCancel={handleClose}
      footer={[
        <Button key="ok" type="primary" onClick={handleClose}>
          확인
        </Button>,
      ]}
    >
      <div style={{ textAlign: "center" }}>
        {status === "success" ? (
          <>
            <Title level={4}>🎉 축하합니다!</Title>
            <Text strong>{decodedItem || "상품명"}</Text>
            <br />
            <Text>에 당첨되셨습니다.<br />내 쿠폰함을 확인해주세요!</Text>
          </>
        ) : (
          <>
            <Title level={4} type="danger">실패</Title>
            <Text>
              랜덤박스 열기에 실패했습니다.<br />
              다시 시도해주세요.<br />
              계속 오류가 발생하면 관리자에게 신고해주세요.
            </Text>
          </>
        )}
      </div>
    </Modal>
  );
};

export default RandomBoxResult;
