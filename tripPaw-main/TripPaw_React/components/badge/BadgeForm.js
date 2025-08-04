import React, { useState } from 'react';
import { Input, Select, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const BadgeForm = ({ onCancel, onSuccess }) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [badge, setBadge] = useState({
    name: '',
    weight: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBadge((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeightChange = (value) => {
    setBadge((prev) => ({ ...prev, weight: value }));
  };

  const beforeUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('이미지 파일만 업로드 가능합니다.');
      return false;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    return false; // 수동 업로드
  };

  const handleSubmit = async () => {
    if (!badge.name || !badge.weight || !badge.description || !imageFile) {
      message.error('모든 항목을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append(
      'badge',
      new Blob([JSON.stringify(badge)], { type: 'application/json' })
    );
    formData.append('image', imageFile);

    try {
      await axios.post('/admin/badge', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('뱃지가 등록되었습니다.');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      message.error('뱃지 등록 실패');
    }
  };

  return (
    <div style={{ width: 400, margin: 'auto' }}>
      <div style={{ textAlign: 'center' }}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="미리보기"
            style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
          />
        ) : (
          <div style={{ width: 120, height: 120, backgroundColor: '#000', margin: 'auto', marginBottom: 8 }} />
        )}
        <Upload showUploadList={false} beforeUpload={beforeUpload}>
          <Button icon={<UploadOutlined />}>이미지 등록</Button>
        </Upload>
      </div>

      <Input
        name="name"
        placeholder="뱃지 이름"
        value={badge.name}
        onChange={handleChange}
        style={{ marginTop: 16 }}
      />

      <Input
        type="number"
        name="weight"
        placeholder="무게 (g)"
        value={badge.weight}
        onChange={handleChange}
        style={{ width: '100%', marginTop: 16 }}
        min={0}
      />

      <TextArea
        name="description"
        placeholder="뱃지 설명"
        value={badge.description}
        onChange={handleChange}
        rows={4}
        style={{ marginTop: 16 }}
      />

      <Button
        type="primary"
        block
        onClick={handleSubmit}
        style={{ marginTop: 24, fontWeight: 'bold' }}
      >
        만들기
      </Button>
      <Button block onClick={onCancel} style={{ marginTop: 8 }}>
        취소
      </Button>
    </div>
  );
};

export default BadgeForm;
