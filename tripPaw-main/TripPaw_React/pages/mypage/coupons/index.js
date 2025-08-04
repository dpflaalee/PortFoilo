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
  message,
  Popconfirm,
  Collapse
} from "antd";
import axios from "axios";
import ScratchCard from "react-scratchcard";

import { motion } from "framer-motion";

const { Panel } = Collapse;
const { Title } = Typography;

/* ---------- 유틸 ---------- */
const getValidImageUrl = (url) => {
  if (!url) return "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
  if (url.startsWith("ipfs://"))
    return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  if (url.includes("ipfs.io"))
    return url.replace("https://ipfs.io/ipfs/", "https://gateway.pinata.cloud/ipfs/");
  return url;
};
const isUsed = (usedAt) => usedAt && usedAt !== "null";

/* ---------- 메인 컴포넌트 ---------- */
const Coupons = () => {
  /* state */
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberId, setMemberId] = useState(null);

  /* 사용·선물 모달 */
  const [useModalVisible, setUseModalVisible] = useState(false);
  const [pendingUseNft, setPendingUseNft] = useState(null);
  const [isScratched, setIsScratched] = useState(false);

  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [giftTargetNft, setGiftTargetNft] = useState(null);
  const [giftNickname, setGiftNickname] = useState("");
  const [giftMessage, setGiftMessage] = useState("");         

  /* 상세 보기 모달 */
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);

  /* fetch */
  const fetchNfts = async () => {
    if (!memberId) return;
    try {
      const { data } = await axios.get(`/api/member-nft/${memberId}`);
      setNfts(data);
    } catch (err) {
      message.error("NFT 불러오기 실패: " + err.message);
    }
  };

 // 1단계: memberId를 가져오는 init
useEffect(() => {
  const init = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/auth/check", { withCredentials: true });
      const id = Number(data.memberId);
      if (isNaN(id)) {
        message.error("memberId가 숫자가 아닙니다.");
        return;
      }
      setMemberId(id);
    } catch (err) {
      message.error("초기 데이터 로딩 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  init();
}, []);

// 2단계: memberId가 바뀌면 NFT 리스트를 불러옴
useEffect(() => {
  if (!memberId) return;
  fetchNfts();
}, [memberId]);

  /* NFT 사용 */
  const onUse = (nft) => {
    setPendingUseNft(nft);
    setIsScratched(false);
    setUseModalVisible(true);
  };
  const handleUseConfirm = async () => {
    if (!pendingUseNft) return;
    try {
      await axios.post(`/api/member-nft/use/${pendingUseNft.id}`);
      message.success(`${pendingUseNft.pointValue} 포인트 사용 완료`);
      setNfts((prev) => prev.filter((n) => n.id !== pendingUseNft.id));
      setIsScratched(true);
    } catch (err) {
      message.error("사용 실패: " + err.message);
    }
  };

  /* NFT 삭제 */
  const onDelete = async (nftId) => {
    try {
      await axios.delete(`/api/member-nft/${nftId}`, { params: { memberId } });
      message.success("삭제 성공");
      fetchNfts();
    } catch (err) {
      message.error("삭제 실패: " + err.message);
    }
  };

  /* 상세 모달 */
  const showDetailModal = (nft) => {
    setSelectedNft(nft);
    setDetailModalVisible(true);
  };

  /* 스타일 */
  const styles = {
    container: { padding: 24, minHeight: "calc(100vh - 100px)", background: "#f0f2f5" },
    title: {
      marginBottom: 24,
      color: "#1890ff",
      borderBottom: "3px solid #1890ff",
      paddingBottom: 8,
      fontWeight: "bold",
      fontSize: 28,
      textAlign: "center",
    },
    cardImage: {
      width: "100%",
      height: 200,
      objectFit: "contain",
      borderRadius: 8,
      background: "#fafafa",
      border: "1px solid #ddd",
    },
    empty: { textAlign: "center", marginTop: 50, fontSize: 20, color: "#888" },
    input: { width: "100%", padding: 8, fontSize: 16, borderRadius: 4, border: "1px solid #d9d9d9" },
    textarea: {
      width: "100%",
      minHeight: 80,
      padding: 8,
      fontSize: 16,
      borderRadius: 4,
      border: "1px solid #d9d9d9",
      marginTop: 12,
    },
  };

  /* 선물 API 호출 */
  const sendGift = async () => {
    if (!giftNickname || !giftTargetNft) {
      message.warning("받는 사람 닉네임을 입력해주세요.");
      return;
    }
    try {
      await axios.post(
        `/api/member-nft/gift/${giftTargetNft.id}`,
        { message: giftMessage },                                  
        {
          params: {
            fromMemberId: memberId,
            toNickname: giftNickname,
          },
        }
      );
      message.success("NFT 선물 완료!");
      setGiftModalVisible(false);
      setGiftTargetNft(null);
      setGiftMessage("");
      fetchNfts();
    } catch (err) {
      message.error("선물 실패: " + (err.response?.data || err.message));
    }
  };

  // Balloon 기본형 (기존)
const Balloon = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    whileHover={{ scale: 1.05 }}
    style={{
      display: "flex",
      alignItems: "flex-start",
      marginBottom: 16,
      backgroundColor: "#f6ffed",
      padding: "16px 20px",
      borderRadius: 12,
      border: "1px solid #b7eb8f",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      cursor: "default",
    }}
  >
    <div style={{ fontSize: 36, marginRight: 16 }}>🐾</div>
    <div style={{ fontSize: 16, lineHeight: "1.6" }}>{children}</div>
  </motion.div>
);


  /* ------------------------------------------------------------------ */
  return (
    <MypageLayout>
      <div style={styles.container}>
        <Title style={styles.title}>NFT 쿠폰 리스트</Title>

      <Balloon>
  <strong>안녕하세요! 저는 NFT 도우미에요 🧾</strong>
  <br />
  쿠폰 사용이 처음이라면 아래 <strong>"도움말 더 보기"</strong>를 눌러보세요!
</Balloon>

<Collapse style={{ marginBottom: 24 }}>
  <Panel header="도움말 더 보기" key="1">
    <p>1. NFT 쿠폰은 '사용' 버튼을 눌러서 스크래치 카드를 긁어야 포인트가 적립됩니다.</p>
    <p>2. '선물' 버튼으로 다른 회원에게 NFT를 선물할 수 있습니다.</p>
    <p>3. 사용한 쿠폰은 리스트에서 사라집니다.</p>
    <p>4. 쿠폰 상세 정보에서 발급 이유, 만료일 등을 확인할 수 있습니다.</p>
  </Panel>
</Collapse>


        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
        ) : nfts.length ? (
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
                    <Button
                      key="gift"
                      type="link"
                      disabled={isUsed(nft.usedAt)}
                      onClick={() => {
                        setGiftTargetNft(nft);
                        setGiftNickname("");
                        setGiftMessage("");           // 초기화
                        setGiftModalVisible(true);
                      }}
                    >
                      선물
                    </Button>,
                    <Button
                      key="use"
                      type="link"
                      disabled={isUsed(nft.usedAt)}
                      onClick={() => onUse(nft)}
                    >
                      {isUsed(nft.usedAt) ? "사용 완료" : "사용"}
                    </Button>,
                    <Button key="details" type="link" onClick={() => showDetailModal(nft)}>
                      상세
                    </Button>,
                    <Popconfirm
                      key="delete"
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
                  style={{ borderRadius: 12 }}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div style={styles.empty}>표시할 NFT가 없습니다.</div>
        )}

        {/* ---------- NFT 선물 모달 ---------- */}
        <Modal
          title="NFT 선물하기"
          open={giftModalVisible}
          onCancel={() => {
            setGiftModalVisible(false);
            setGiftTargetNft(null);
            setGiftMessage("");
          }}
          onOk={sendGift}
          okText="선물하기"
          cancelText="취소"
          bodyStyle={{ padding: 16 }}
        >
          <input
            type="text"
            value={giftNickname}
            onChange={(e) => setGiftNickname(e.target.value)}
            style={styles.input}
            placeholder="받는 사람 닉네임"
          />
          <textarea
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
            style={styles.textarea}
            placeholder="선물 메시지(선택)"
          />
        </Modal>

        {/* ---------- 스크래치 모달 ---------- */}
        <Modal
          title="쿠폰 스크래치"
          open={useModalVisible}
          onCancel={() => {
            setUseModalVisible(false);
            setPendingUseNft(null);
          }}
          footer={null}
          bodyStyle={{ textAlign: "center" }}
        >
          {pendingUseNft && (
            <ScratchCard
              key={pendingUseNft.id}
              width={300}
              height={300}
              image={getValidImageUrl(pendingUseNft.imageUrl)}
              finishPercent={50}
              onComplete={handleUseConfirm}
            >
              {!isScratched ? (
                <div style={{ height: 300 }} />
              ) : (
                <div style={{ padding: 16 }}>
                  <h3>🎉 {pendingUseNft.pointValue} 포인트 당첨!</h3>
                  <img
                    src={`https://barcode.tec-it.com/barcode.ashx?data=${pendingUseNft.barcode}&code=Code128&translate-esc=false`}
                    alt="바코드"
                    style={{ width: "80%", maxWidth: 250, margin: "8px 0 16px" }}
                  />
                </div>
              )}
            </ScratchCard>
          )}
          <Button style={{ marginTop: 16 }} onClick={() => setUseModalVisible(false)}>
            닫기
          </Button>
        </Modal>

        {/* ---------- 상세 정보 모달 ---------- */}
        <Modal
          title="NFT 상세 정보"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
        >
          {selectedNft && (
            <div style={{ textAlign: "center" }}>
              <h3>{selectedNft.title}</h3>
              <img
                src={getValidImageUrl(selectedNft.imageUrl)}
                alt={selectedNft.title}
                style={styles.cardImage}
              />
              <p>
                <strong>포인트:</strong> {selectedNft.pointValue} P
              </p>
              <p>
                <strong>발급 이유:</strong> {selectedNft.issuedReason || "정보 없음"}
              </p>
              <p>
                <strong>발급일:</strong>{" "}
                {selectedNft.issuedAt ? new Date(selectedNft.issuedAt).toLocaleDateString() : "정보 없음"}
              </p>
              <p>
                <strong>만료일:</strong>{" "}
                {selectedNft.dueAt ? new Date(selectedNft.dueAt).toLocaleDateString() : "정보 없음"}
              </p>
              <p>
                <strong>바코드:</strong> {selectedNft.barcode}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </MypageLayout>
  );
};

export default Coupons;
