import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Input, Button, Select } from 'antd';
import {CloseOutlined} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux';
import { addAniProfile } from '@/reducers/animal';
import { useRouter } from 'next/router';
import axios from 'axios';
import { LOAD_CATEGORIES_REQUEST } from '@/reducers/category';
const { Option } = Select;



const AniProfileForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const imageInput = useRef();

  const onCancel = () => {
    router.back();
  }
  // 카테고리
  useEffect(() => {
    dispatch({ type: LOAD_CATEGORIES_REQUEST });
  }, []);
  const { categories } = useSelector(state => state.category);

  const [form, setForm] = useState({
    aniName: '',
    aniAge: '',
    previewUrl: '',
    file: null,
    categoryId: null,
  });

  const onClickImageUpload = useCallback(() => {
    imageInput.current?.click();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        aniProfile: file,
        previewUrl: URL.createObjectURL(file),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setForm((prev) => ({
      ...prev,
      categoryId: Number(value),
    }));
  };

  const handleSubmit = async () => {

    const formData = new FormData();
    formData.append('aniName', form.aniName);
    formData.append('aniAge', form.aniAge);
    formData.append('categoryId', form.categoryId);
    formData.append('aniProfile', form.aniProfile); // 파일 전송

    try {
      const res = await axios.post('/animal/animalform', formData); 
      const newAnimalId = res.data.id;
      router.push(`/animal/${newAnimalId}`);
    } catch (error) {
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: 300,
        margin: 'auto',
        padding: 20,
        border: '1px solid #ddd',
        borderRadius: 10,
        textAlign: 'center',
      }}
    >
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={onCancel}
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 10,
          fontSize: 20,
          color: '#666',
        }}
      />
      {form.previewUrl ? (
        <img
          src={form.previewUrl}
          alt="preview"
          onClick={() => imageInput.current?.click()}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: 10,
            cursor: 'pointer',
          }}
        />
      ) : (
        <div
        onClick={() => imageInput.current?.click()}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#111',
            margin: 'auto',
            marginBottom: 10,
            cursor: 'pointer',
          }}
        />
      )}

      <Input
        name="aniName"
        value={form.aniName}
        onChange={handleChange}
        placeholder="이름"
        style={{ marginBottom: 10 }}
      />
      <Input
        name="aniAge"
        type="number"
        value={form.aniAge}
        onChange={handleChange}
        placeholder="나이"
        min="0"
        style={{ marginBottom: 10 }}
      />
      <Select
        placeholder="동물 종"
        value={form.categoryId !== null ? form.categoryId : undefined}
        onChange={handleCategoryChange}
        style={{ width: '100%', marginBottom: 10 }}
      >
        {categories
          .filter((v) => v.isAnimal)
          .map((v) => (
            <Option key={v.id} value={v.id}>
              {v.content}
            </Option>
          ))}
      </Select>

      <input
        type="file"
        accept="image/*"
        hidden
        ref={imageInput}
        onChange={handleFileChange}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onClickImageUpload}>사진</Button>
        <Button type="primary" onClick={handleSubmit}>
          프로필 등록하기
        </Button>
      </div>
    </div>
  );
};

export default AniProfileForm;
