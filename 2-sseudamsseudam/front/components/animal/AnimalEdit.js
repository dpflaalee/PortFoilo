import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { MODIFY_ANIPROFILE_REQUEST, RESET_MODIFY_ANIPROFILE_STATE } from '@/reducers/animal';
import { CloseOutlined } from '@ant-design/icons';
import { LOAD_CATEGORIES_REQUEST } from '@/reducers/category';
const { Option } = Select;

const AnimalEdit = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const onCancel = () => {
    router.back();
  }
  // 카테고리
  useEffect(() => {
    dispatch({ type: LOAD_CATEGORIES_REQUEST });
  }, []);
  const { categories } = useSelector(state => state.category);

  const imageInput = useRef(null);
  const { modifyAniprofileDone, modifyAniprofileError } = useSelector((state) => state.animal);

  const [form, setForm] = useState({
    aniName: '',
    aniAge: '',
    aniProfile: '',
    previewUrl: '',
    categoryId: null,
  });

  useEffect(() => {
    if (id) {
      axios.get(`/animal/${id}`).then((res) => {
        const { aniName, aniAge, aniProfile, CategoryId } = res.data.animal;
        setForm({
          aniName,
          aniAge,
          aniProfile,
          previewUrl: aniProfile ? `http://localhost:3065/uploads/animalProfile/${aniProfile}` : '',
          categoryId: CategoryId,
        });
      })
        .catch((err) => {
        });
    }
  }, [id]);

  useEffect(() => {
    if (modifyAniprofileDone) {
      message.success('수정 완료!');
      dispatch({type: RESET_MODIFY_ANIPROFILE_STATE});
      router.push(`/animal/${id}`);
    }
    if (modifyAniprofileError) {
      message.error('수정 실패!');
    }
  }, [modifyAniprofileDone, modifyAniprofileError]);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryChange = (value) => {
    setForm((prev) => ({ ...prev, categoryId: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (form.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(form.previewUrl); // 기존 blob URL 해제
      }
      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({
        ...prev,
        aniProfile: file,
        previewUrl,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('aniName', form.aniName);
    formData.append('aniAge', form.aniAge);
    formData.append('categoryId', form.categoryId);
    // 이미지가 새로 선택된 경우에만 추가
    if (form.aniProfile instanceof File) {
      formData.append('aniProfile', form.aniProfile);
    }

    dispatch({
      type: MODIFY_ANIPROFILE_REQUEST,
      data: {
        id,
        formData,
      },
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div style={{ position: 'relative', width: 300, margin: 'auto', padding: 20, border: '1px solid #ddd', borderRadius: 10, textAlign: 'center' }}>
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
          <img onClick={() => imageInput.current?.click()} src={form.previewUrl} alt="preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 10, cursor: 'pointer' }} />
        ) : (
          <div onClick={() => imageInput.current?.click()} style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#111', margin: 'auto', marginBottom: 10, cursor: 'pointer' }} />
        )}
        <input type="file" accept="image/*" hidden ref={imageInput} onChange={handleFileChange} />

        <Input name="aniName" value={form.aniName} onChange={onChange} placeholder="이름" style={{ marginBottom: 10 }} />
        <Input name="aniAge" type="number" value={form.aniAge} onChange={onChange} placeholder="나이" min="0" style={{ marginBottom: 10 }} />
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => imageInput.current?.click()}>사진</Button>
          <Button type="primary" htmlType="submit" >
            수정하기
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AnimalEdit;
