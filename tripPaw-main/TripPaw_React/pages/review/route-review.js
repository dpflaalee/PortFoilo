import React, { useState, useEffect } from "react";
import {
  Tabs,
  List,
  Avatar,
  Rate,
  Tag,
  Button,
  Image,
  Spin,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  message
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/router";
import styled from 'styled-components';
import AppLayout from "@/components/AppLayout";
import { Pagination } from "antd";

const ScrollContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  overflow-y: auto;
`;
const MAX_CONTENT_LENGTH = 100;

const getValidImageUrl = (url) => {
  if (!url) return "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
  if (url.startsWith("ipfs://")) return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  if (url.includes("ipfs.io")) return url.replace("https://ipfs.io/ipfs/", "https://gateway.pinata.cloud/ipfs/");
  return url;
};

const ReviewList = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("latest");
  const [likeStates, setLikeStates] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(5);

  const [memberId, setMemberId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [nfts, setNfts] = useState([]);
  const [issueModalVisible, setIssueModalVisible] = useState(false);
  const [selectedNftId, setSelectedNftId] = useState(null);
  const [selectedReviewUser, setSelectedReviewUser] = useState(null);
  const [issueForm] = Form.useForm();

  // 사용자 권한 정보 로드
  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await axios.get("/api/auth/check", { withCredentials: true });
        setMemberId(res.data.memberId);
        setIsAdmin(res.data.auth === "ADMIN");
      } catch (err) {
      }
    };
    fetchAuth();
  }, []);

  useEffect(() => {
    if (memberId !== null) {
      fetchReviews(sort, page);
    }
  }, [sort, memberId, page]);

  const fetchReviews = async (sortKey = "latest", page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`/review/plan`, {
        params: { sort: sortKey, page, size }
      });

      console.log("응답 결과", response.data); // 확인용

      const { content = [], totalPages = 0 } = response.data;
      setReviews(content);
      setTotalPages(totalPages);

      const newStates = {};
      for (let review of content) {
        const [likedRes, countRes] = await Promise.all([
          axios.get(`/review/${review.reviewId}/like/marked`, { params: { memberId } }),
          axios.get(`/review/${review.reviewId}/like/count`)
        ]);
        newStates[review.reviewId] = {
          liked: likedRes.data,
          count: countRes.data
        };
      }
      setLikeStates(newStates);
    } catch (err) {
    }
    setLoading(false);
  };


  const fetchNfts = async () => {
    try {
      const res = await axios.get("/api/nft/metadata");
      setNfts(res.data);
    } catch (err) {
      message.error("NFT 목록 로딩 실패");
    }
  };

  const toggleContent = (id) => {
    setExpandedReviewId(expandedReviewId === id ? null : id);
  };

  const toggleLike = async (reviewId) => {
    const current = likeStates[reviewId];
    try {
      if (current?.liked) {
        await axios.delete(`/review/${reviewId}/like`, { params: { memberId } });
      } else {
        await axios.post(`/review/${reviewId}/like`, null, { params: { memberId } });
      }

      const [likedRes, countRes] = await Promise.all([
        axios.get(`/review/${reviewId}/like/marked`, { params: { memberId } }),
        axios.get(`/review/${reviewId}/like/count`)
      ]);
      setLikeStates({
        ...likeStates,
        [reviewId]: {
          liked: likedRes.data,
          count: countRes.data
        }
      });
    } catch (err) {
    }
  };

  const openIssueModal = (nickname) => {
    setSelectedReviewUser(nickname);
    setSelectedNftId(null);
    setIssueModalVisible(true);
    issueForm.resetFields();

    fetchNfts();
  };

  const onIssueFinish = async (values) => {
    const { issuedReason } = values;
    if (!selectedNftId || !selectedReviewUser) {
      message.error("NFT 및 닉네임 선택 필수");
      return;
    }

    try {
      await axios.post(`/api/admin/nft/issue-to-member`, null, {
        params: {
          nftMetadataId: selectedNftId,
          issuedReason,
          nickname: selectedReviewUser,
        },
      });
      message.success("NFT 발급 성공");
      setIssueModalVisible(false);
      fetchNfts();
    } catch (err) {
    }
  };

  const getContent = (item) => {
    if (expandedReviewId === item.reviewId || item.content.length <= MAX_CONTENT_LENGTH) {
      return item.content;
    }
    return item.content.slice(0, MAX_CONTENT_LENGTH) + "...";
  };

  //////
  return (
    <AppLayout>
      <div style={{ maxWidth: 900, margin: "auto", padding: 24 }}>
        <ScrollContainer>
          <h2 style={{ fontSize: "22px", fontWeight: 700, marginTop: 50 }}>사용자 리뷰</h2>

          <Tabs
            activeKey={sort}
            onChange={(key) => setSort(key)}
            centered
            items={[
              { label: "추천순", key: "recommended" },
              { label: "최신순", key: "latest" },
              { label: "높은평점순", key: "high" },
              { label: "낮은평점순", key: "low" },
            ]}
          />

          {loading ? (
            <Spin tip="리뷰 불러오는 중..." />
          ) : (
            <>
              <List
                itemLayout="vertical"
                dataSource={reviews}
                renderItem={(item) => (
                  <List.Item key={item.reviewId} style={{ borderBottom: "1px solid #ccc", paddingBottom: 24, marginBottom: 32, }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 8,
                        marginBottom: 12,
                      }}
                    >
                      {/* 왼쪽: 플랜 제목 */}
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          color: "#333",
                          cursor: "pointer",
                        }}
                        onClick={() => router.push(`/review/tripPlan/${item.tripPlanId}`)}
                      >
                        📌 여행 플랜: {item.planTitle}
                      </div>

                      {/* 오른쪽: 별점 + 평균 */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Rate
                          value={item.avgRating}
                          disabled
                          style={{ fontSize: 14, lineHeight: 1 }}
                        />
                        <div style={{ fontSize: 12, color: "#555", lineHeight: 1 }}>
                          평균 ★ {item.avgRating?.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid #eee",
                        marginTop: 8,
                        paddingTop: 16,
                      }}
                    />
                    {/* 유저 정보 & 작성일 & 별점 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 12,
                      }}
                    >
                      <Avatar size={48} />
                      <div style={{ marginLeft: 12 }}>
                        <div style={{ fontWeight: 600 }}>{item.memberNickname}</div>
                        <Rate value={item.rating} disabled style={{ fontSize: 14 }} />
                      </div>

                      {/* 구분선 및 작성일 정보 */}
                      <div
                        style={{
                          borderLeft: "1px solid #ddd",
                          marginLeft: 24,
                          paddingLeft: 24,
                          fontSize: 12,
                          color: "#888",
                        }}
                      >
                        작성일: {item.createdAt?.slice(0, 10)}
                      </div>
                    </div>

                    {/* 내용 */}
                    <div
                      style={{
                        marginTop: 12,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        width: "100%",
                      }}
                    >
                      {getContent(item)}
                      {item.content.length > MAX_CONTENT_LENGTH && (
                        <Button
                          type="link"
                          size="small"
                          icon={<EllipsisOutlined />}
                          onClick={() => toggleContent(item.reviewId)}
                        >
                          {expandedReviewId === item.reviewId ? "접기" : "더보기"}
                        </Button>
                      )}
                    </div>

                    {/* 이미지들 */}
                    {item.imageUrls && (
                      <Image.PreviewGroup>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            marginTop: 12,
                            flexWrap: "wrap",
                          }}
                        >
                          {item.imageUrls.split(",").map((src, idx) => (
                            <Image
                              key={idx}
                              width={120}
                              height={120}
                              style={{
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                              src={`/upload/reviews/${src}`}
                            />
                          ))}
                        </div>
                      </Image.PreviewGroup>
                    )}

                    <div style={{ marginTop: 16 }}>
                      <Button
                        block
                        type={likeStates[item.reviewId]?.liked ? "primary" : "default"}
                        onClick={() => toggleLike(item.reviewId)}
                      >
                        👍 도움이 돼요 {likeStates[item.reviewId]?.count ?? 0}
                      </Button>
                    </div>

                    {isAdmin && (
                      <div style={{ marginTop: 12 }}>
                        <Button block type="dashed" onClick={() => openIssueModal(item.memberNickname)}>
                          🎁 NFT 발급
                        </Button>
                      </div>
                    )}
                  </List.Item>
                )}
              />
              <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                <Pagination
                  current={page + 1}          // UI에 표시될 현재 페이지 (1-based)
                  total={totalPages * size}   // 전체 아이템 수 = 페이지 수 * 페이지당 개수
                  pageSize={size}             // 페이지당 아이템 수
                  onChange={(p) => setPage(p - 1)} // 이벤트 핸들러 (0-based로 세팅)
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </ScrollContainer>

        <Modal
          title="NFT 발급"
          open={issueModalVisible}
          onCancel={() => setIssueModalVisible(false)}
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

            <div style={{ marginTop: 16 }}>
              <h4>쿠폰 NFT 선택</h4>
              <Row gutter={[16, 16]}>
                {nfts.map((nft) => (
                  <Col span={8} key={nft.id}>
                    <Card
                      hoverable={!nft.issued}
                      onClick={() => {
                        if (!nft.issued) setSelectedNftId(nft.id);
                      }}
                      style={{
                        border: selectedNftId === nft.id ? "2px solid #1890ff" : "1px solid #ccc",
                        opacity: nft.issued ? 0.5 : 1,
                        position: "relative",
                        cursor: nft.issued ? "not-allowed" : "pointer",
                      }}
                      cover={
                        <img
                          alt={nft.title}
                          src={getValidImageUrl(nft.imageUrl)}
                          style={{ height: 180, objectFit: "cover", filter: nft.issued ? "grayscale(100%)" : "none" }}
                        />
                      }
                    >
                      <Card.Meta
                        title={
                          <>
                            {nft.title}
                            {nft.issued && (
                              <span style={{ marginLeft: 8, color: "red", fontWeight: "bold" }}>
                                (발급 완료)
                              </span>
                            )}
                          </>
                        }
                        description={`포인트: ${nft.pointValue}`}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );

};
export default ReviewList;
