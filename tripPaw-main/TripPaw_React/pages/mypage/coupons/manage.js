import MypageLayout from "@/components/layout/MyPageLayout";
import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";

const { Title } = Typography;

const getValidImageUrl = (url) => {
  if (!url) return "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  }
  if (url.includes("ipfs.io")) {
    return url.replace("https://ipfs.io/ipfs/", "https://gateway.pinata.cloud/ipfs/");
  }
  return url;
};

const CouponsManage = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingNft, setEditingNft] = useState(null);
  const [editForm] = Form.useForm();

  const [isIssueModalVisible, setIssueModalVisible] = useState(false);
  const [issueForm] = Form.useForm();
  const [issueNftMetadataId, setIssueNftMetadataId] = useState(null);

  const fetchNfts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/nft/metadata");
      setNfts(res.data);
    } catch (error) {
      message.error("NFT 불러오기 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNfts();
  }, []);

  const openEditModal = (nft) => {
    setEditingNft(nft);
    editForm.setFieldsValue({
      title: nft.title,
      imageUrl: nft.imageUrl,
      pointValue: nft.pointValue,
    });
    setEditModalVisible(true);
  };

  const onEditFinish = async (values) => {
    try {
      await axios.put(`/api/nft/metadata/${editingNft.id}`, values);
      message.success("수정 성공");
      setEditModalVisible(false);
      setEditingNft(null);
      fetchNfts();
    } catch (error) {
      message.error("수정 실패: " + error.message);
    }
  };

  const onDelete = async (metadataId) => {
    try {
      await axios.delete(`/api/nft/metadata/${metadataId}`);
      message.success("NFT 템플릿과 사용된 쿠폰 모두 삭제 완료");
      setNfts((prev) => prev.filter((nft) => nft.id !== metadataId));
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.status === 409
      ) {
        Modal.confirm({
          title: "삭제 불가",
          content: (
            <>
              <p>{error.response.data.error}</p>
              <p>강제 삭제하시겠습니까?</p>
            </>
          ),
          okText: "강제 삭제",
          cancelText: "취소",
          onOk: () => forceDelete(metadataId),
        });
      } else {
        message.error("삭제 중 오류 발생: " + error.message);
      }
    }
  };

const forceDelete = async (metadataId) => {
    try {
      await axios.delete(`/api/nft/metadata/${metadataId}/force`);
      message.success("NFT 강제 삭제 완료");
      setNfts((prev) => prev.filter((nft) => nft.id !== metadataId));
    } catch (error) {
      message.error("강제 삭제 실패: " + error.message);
    }
  };


  const syncNftsFromBlockchain = async () => {
    const contractAddress = "0x3c1011554E887c1a0CFD5e93535958b03b140c09";
    const walletAddress = "0x59ae01d894f9B0a73EDA9427E5499Ee80De329Cf";
    try {
      await axios.post(`/api/nft/sync-tokens?contractAddress=${contractAddress}&walletAddress=${walletAddress}`);
      message.success("NFT 동기화 완료");
      fetchNfts();
    } catch (err) {
      message.error("동기화 실패: " + err.message);
    }
  };

  const openIssueModal = (nftId) => {
    setIssueNftMetadataId(nftId);
    issueForm.resetFields();
    setIssueModalVisible(true);
  };

  const onIssueFinish = async (values) => {
    const { issuedReason, nickname } = values;
    if (!nickname || typeof nickname !== "string") {
      message.error("닉네임을 올바르게 입력해주세요.");
      return;
    }

    try {
      await axios.post(`/api/admin/nft/issue-to-member`, null, {
        params: {
          nftMetadataId: issueNftMetadataId,
          issuedReason,
          nickname: nickname.toString().trim(),
        },
      });

      setNfts((prevNfts) =>
        prevNfts.map((nft) =>
          nft.id === issueNftMetadataId ? { ...nft, issued: true } : nft
        )
      );

      message.success("NFT 발급 완료");
      setIssueModalVisible(false);
      setIssueNftMetadataId(null);
    } catch (error) {
      message.error("NFT 발급 실패: " + error.message);
    }
  };

  
  const styles = {
    container: {
      padding: 24,
      backgroundColor: "#f9fafb",
      minHeight: "calc(100vh - 100px)",
    },
    header: {
      marginBottom: 24,
      borderBottom: "2px solid #1890ff",
      paddingBottom: 8,
      fontWeight: "bold",
      color: "#1890ff",
    },
    syncButtonWrapper: {
      textAlign: "right",
      marginBottom: 20,
    },
    cardImage: {
      width: "100%",
      height: 330,
      objectFit: "cover",
      borderRadius: 8,
    },
    emptyMessage: {
      textAlign: "center",
      marginTop: 50,
      color: "#888",
      fontSize: 18,
      fontWeight: "500",
    },
  };

  return (
    <MypageLayout>
      <div style={styles.container}>
        <Title level={2} style={styles.header}>
          NFT 쿠폰 리스트
        </Title>

        <div style={styles.syncButtonWrapper}>
          <Button type="primary" onClick={syncNftsFromBlockchain}>
            NFT 동기화
          </Button>
        </div>

        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
        ) : nfts.length > 0 ? (
          <Row gutter={[24, 24]}>
            {nfts.map((nft) => (
              <Col key={nft.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={nft.title}
                      src={getValidImageUrl(nft.imageUrl)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
                      }}
                      style={styles.cardImage}
                    />
                  }
                  actions={[
                    nft.issued ? (
                      <Button type="primary" disabled>
                        발급완료
                      </Button>
                    ) : (
                      <Button type="link" onClick={() => openIssueModal(nft.id)}>
                        NFT 발급
                      </Button>
                    ),
                    <Button type="link" onClick={() => openEditModal(nft)}>
                      수정
                    </Button>,
                    <Popconfirm
                      title="정말 삭제하시겠습니까?"
                      onConfirm={() => onDelete(nft.id)}
                      okText="예"
                      cancelText="아니오"
                    >
                      <Button type="link" danger>
                        삭제
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <Card.Meta
                    title={nft.title}
                    description={`포인트: ${nft.pointValue}`}
                    style={{ marginBottom: 12 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div style={styles.emptyMessage}>표시할 NFT가 없습니다.</div>
        )}

        {/* 수정 모달 */}
        <Modal
          title="NFT 쿠폰 수정"
          open={isEditModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingNft(null);
            editForm.resetFields();
          }}
          onOk={() => editForm.submit()}
          okText="수정"
        >
          <Form form={editForm} layout="vertical" onFinish={onEditFinish}>
            <Form.Item label="제목" name="title">
              <Input disabled />
            </Form.Item>
            <Form.Item label="이미지 URL" name="imageUrl">
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="포인트 값"
              name="pointValue"
              rules={[{ required: true, message: "포인트 값을 입력하세요" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 발급 모달 */}
        <Modal
          title="NFT 발급"
          open={isIssueModalVisible}
          onCancel={() => {
            setIssueModalVisible(false);
            setIssueNftMetadataId(null);
            issueForm.resetFields();
          }}
          onOk={() => issueForm.submit()}
          okText="발급하기"
        >
          <Form form={issueForm} layout="vertical" onFinish={onIssueFinish}>
            <Form.Item
              label="발급 이유"
              name="issuedReason"
              rules={[{ required: true, message: "발급 이유를 입력하세요" }]}
            >
              <Input.TextArea placeholder="예: 리뷰 감사 선물" />
            </Form.Item>
            <Form.Item
              label="받는 사용자 닉네임"
              name="nickname"
              rules={[{ required: true, message: "닉네임을 입력하세요" }]}
            >
              <Input placeholder="예: doglover123" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MypageLayout>
  );
};

export default CouponsManage;
