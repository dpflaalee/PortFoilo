import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Modal,
  Row,
  Typography,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import Barcode from "react-barcode";
import dayjs from "dayjs";

import {
  loadMyPrizes,
  useMyPrize,
} from "../../reducers/myPrize";
import {
  loadRandomBoxList,
  openRandomBox,
} from "../../reducers/prize";

const { Text } = Typography;

const MyPrize = () => {
  const dispatch = useDispatch();

  const {
    prizes,
    randomBoxes,
    openRandomBoxLoading,
    openRandomBoxDone,
    latestCoupon,
    loadRandomBoxListLoading,
    loadRandomBoxListError,
  } = useSelector((state) => state.prize);

  const {
    myPrizes,
    loadMyPrizesLoading,
    loadMyPrizesError,
    useMyPrizeLoading,
    useMyPrizeError,
    useMyPrizeDone,
  } = useSelector((state) => state.myPrize);

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(loadRandomBoxList());
    dispatch(loadMyPrizes());
  }, [dispatch]);

  useEffect(() => {
    if (openRandomBoxDone) {
      dispatch(loadRandomBoxList());
      dispatch(loadMyPrizes());

       if (latestCoupon) {
        message.success("쿠폰이 발급되었습니다!");
        Modal.success({
          title: "🎁 당첨 결과",
          content: (
            <>
              <p>{latestCoupon.content}</p>
              <p>발급일: {dayjs(latestCoupon.issuedAt).format("YYYY-MM-DD")}</p>
            </>
          ),
        });
      }
    }
  }, [openRandomBoxDone, latestCoupon, dispatch]);

  // 1) useMyPrize 성공 시 모달 닫기 + selectedCoupon 초기화 + 내 쿠폰 리로드
  useEffect(() => {
    if (useMyPrizeDone) {
      message.success("쿠폰 사용 완료!");
      setIsModalVisible(false);
      setSelectedCoupon(null);
      dispatch(loadMyPrizes());
    }
  }, [useMyPrizeDone, dispatch]);

   // 2) selectedCoupon의 바코드가 준비된 경우에만 모달 띄우기
  useEffect(() => {
    if (
      !useMyPrizeLoading &&
      selectedCoupon?.id &&
      selectedCoupon.barcode &&
      !isModalVisible
    ) {
      setIsModalVisible(true);
    }
  }, [useMyPrizeLoading, selectedCoupon, isModalVisible]);



  useEffect(() => {
  }, [latestCoupon]);

  useEffect(() => {
  if (selectedCoupon) {
  }
}, [selectedCoupon]);


  const handleOpenRandomBox = useCallback(
    (issuedId) => {
      if (!issuedId) return message.warning("잘못된 랜덤박스입니다.");

      const usedBox = myPrizes.find(
        (c) => c.issuedId === issuedId && c.usedAt && c.isRead
      );
      if (usedBox) return message.warning("이미 사용한 랜덤박스입니다.");

      dispatch(openRandomBox(issuedId));
    },
    [dispatch, myPrizes]
  );

  const handleUsePrize = useCallback(
    (prizeId) => {
      const coupon = myPrizes.find((c) => c.id === prizeId);
      if (!coupon) return;

      if (coupon.usedAt && coupon.isRead) {
        return message.warning("이미 사용한 쿠폰입니다.");
      }

      setSelectedCoupon(coupon);
      setIsModalVisible(true);
    },
    [myPrizes]
  );

  const validRandomBoxes = randomBoxes.filter(
    (rb) =>
      rb?.issuedId &&
      !myPrizes.find((c) => c.issuedId === rb.issuedId && c.usedAt && c.isRead)
  );

  const validCoupons = myPrizes.filter(
    (c) => c?.content && c.issuedAt
  );

  if (loadMyPrizesLoading || loadRandomBoxListLoading)
    return <Text>로딩 중...</Text>;

  if (loadMyPrizesError || loadRandomBoxListError)
    return (
      <Text type="danger">
        에러 발생: {String(loadMyPrizesError || loadRandomBoxListError)}
      </Text>
    );

  return (
    <>
      <Card title="내 박스" style={{ marginBottom: 24 }}>
        <Row gutter={[0, 16]}>
          {validRandomBoxes.length === 0 ? (
            <Empty description="받은 랜덤박스가 없습니다." />
          ) : (
            validRandomBoxes.map((rb) => (
              <Col span={24} key={rb.issuedId}>
                <Card
                  type="inner"
                  title={`${rb.category?.content || "알 수 없음"} 랜덤박스`}
                  extra={
                    <Button
                      type="primary"
                      danger
                      loading={openRandomBoxLoading}
                      onClick={() => handleOpenRandomBox(rb.issuedId)}
                    >
                      사용
                    </Button>
                  }
                />
              </Col>
            ))
          )}
        </Row>
      </Card>

      <Card title="내 쿠폰함">
        <Row gutter={[0, 16]}>
          {validCoupons.length === 0 ? (
            <Empty description="받은 쿠폰이 없습니다." />
          ) : (
            validCoupons.map((coupon) => (
              <Col span={24} key={coupon.id}>
                <Card
                  type="inner"
                  title={
                    <>
                      <div>{coupon.content}</div>
                      {coupon.issuedReason && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          발급 사유: {coupon.issuedReason}
                        </Text>
                      )}
                    </>
                  }
                  extra={
                    coupon.usedAt && coupon.isRead ? (
                      <Text type="secondary">사용 완료</Text>
                    ) : (
                      <Button
                        type="primary"
                        loading={useMyPrizeLoading}
                        onClick={() => handleUsePrize(coupon.id)}
                      >
                        사용
                      </Button>
                    )
                  }
                >
                  유효기간: {new Date(coupon.dueAt).toLocaleDateString()}
                  <br />
                  <Text type="warning">쿠폰은 조기 마감될 수 있습니다.</Text>
                </Card>
              </Col>
            ))
          )}
        </Row>
        {useMyPrizeError && (
          <Text type="danger" style={{ marginTop: 8 }}>
            쿠폰 사용 중 오류: {useMyPrizeError}
          </Text>
        )}
      </Card>

       {selectedCoupon && (
        <Modal
          title="쿠폰을 사용하시겠습니까?"
          visible={isModalVisible}
          onOk={() => dispatch(useMyPrize(selectedCoupon.id))}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedCoupon(null); // 모달 닫힐 때 selectedCoupon 초기화
          }}
          okText="사용"
          cancelText="취소"
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            {selectedCoupon.barcode && (
              <>
                <Barcode value={selectedCoupon.barcode} />
                <div style={{ marginTop: 8 }}>
                </div>
              </>
            )}
          </div>

          {!selectedCoupon.image && (
            <p>
              <strong>상품:</strong> {selectedCoupon.content}
            </p>
          )}

          <p>
            <strong>유효기간:</strong>{" "}
            {new Date(selectedCoupon.dueAt).toLocaleDateString()}
          </p>
          {selectedCoupon.barcode && (
            <div style={{ marginTop: 12 }}>
              <strong>사용방법 :</strong>{" "}
               온/오프라인 교환
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default MyPrize;
