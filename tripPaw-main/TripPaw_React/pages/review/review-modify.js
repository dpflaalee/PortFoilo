import React, { useState } from "react";
import { Input, Rate, Button, Upload, Image, Tabs } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { TabPane } = Tabs;

const ReviewEdit = () => {
  const [rating, setRating] = useState(4);
  const [content, setContent] = useState("반려견 뭉이와 함께 처음으로 1박 2일 여행을 다녀왔어요. 숙소에 들어서자마자... 반려견과의 첫 여행지로 정말 추천하고 싶어요!");
  const [fileList, setFileList] = useState([
    {
      uid: "1",
      name: "dog1.png",
      status: "done",
      url: "https://via.placeholder.com/100",
    },
    {
      uid: "2",
      name: "dog2.png",
      status: "done",
      url: "https://via.placeholder.com/100",
    },
  ]);

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const handleSubmit = () => {
    console.log("리뷰 수정:", { rating, content, fileList });
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <Tabs defaultActiveKey="place">
        <TabPane tab="경로 리뷰" key="plan" disabled />
        <TabPane tab="장소 리뷰" key="place">
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, background: "#eee", marginRight: 12 }}></div>
            <div>
              <div style={{ fontWeight: "bold" }}>함께할개사랑할개</div>
              <div style={{ color: "gray" }}>애견카페(장소 분류 ex.카페, 숙소, 공원 등)</div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>이 장소에서의 경험은 어떠셨나요?</div>
            <Rate value={rating} onChange={setRating} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>이 장소에 대한 리뷰를 남겨주세요!</div>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              showCount
              maxLength={5000}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              listType="picture-card"
              beforeUpload={() => false} // 업로드 비활성화 (커스텀 처리용)
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <UploadOutlined /> <div>사진 첨부하기</div>
                </div>
              )}
            </Upload>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button>취소</Button>
            <Button type="primary" onClick={handleSubmit}>
              수정하기
            </Button>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ReviewEdit;
