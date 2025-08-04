import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Input, Rate, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const ReviewEditPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [memberId, setMemberId] = useState(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchMember = async () => {
      const res = await axios.get("/api/auth/check", { withCredentials: true });
      setMemberId(res.data.id);
    };
    fetchMember();
  }, []);
  // 리뷰 불러오기
  useEffect(() => {
    if (!router.isReady || !router.query.id) return;

    const id = router.query.id;

    if (typeof id !== "string" && typeof id !== "number") {
      return;
    }

    const fetchReview = async () => {
      try {
        const res = await axios.get(`/review/${id}`);
        setRating(res.data.rating);
        setContent(res.data.content);
      } catch (err) {
      }
    };

    fetchReview();
  }, [router.isReady, router.query.id]);

  // 리뷰 수정 요청
  const handleSubmit = async () => {
    const formData = new FormData();

    // 1. review JSON 객체를 문자열로
    const review = {
      content,
      rating,
      member: { id: memberId },
    };
    formData.append("review", new Blob([JSON.stringify(review)], { type: "application/json" }));

    // 2. 새로 추가된 파일만 업로드 (status === 'done' 은 기존 파일)
    fileList.forEach((file) => {
      if (!file.url) {
        formData.append("images", file.originFileObj); // 새 파일만 처리
      }
    });

    try {
      await axios.put(`/review/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("리뷰가 수정되었습니다.");
      router.push("/mypage"); // 이동 경로 필요시 변경
    } catch (err) {
      message.error("리뷰 수정에 실패했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 24 }}>
      <h2>리뷰 수정</h2>

      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>평점</div>
        <Rate value={rating} onChange={setRating} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>내용</div>
        <TextArea rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          beforeUpload={() => false}
          multiple
        >
          {fileList.length < 8 && (
            <div>
              <UploadOutlined />
              <div>사진 첨부</div>
            </div>
          )}
        </Upload>
      </div>

      <Button type="primary" onClick={handleSubmit}>
        수정하기
      </Button>
    </div>
  );
};

export default ReviewEditPage;
