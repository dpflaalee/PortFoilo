import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, List, Avatar, Button, Spin, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SEARCH_PROFILES_REQUEST } from '@/reducers/animal';
import { LOAD_CATEGORIES_REQUEST } from '@/reducers/category';

const { Option } = Select;


const AnimalSearch = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { searchResults, searchProfilesLoading } = useSelector((state) => state.animal);

  // 카테고리
  useEffect(() => {
    dispatch({ type: LOAD_CATEGORIES_REQUEST });
  }, []);
  const { categories } = useSelector(state => state.category);

  const [form, setForm] = useState({
    aniName: '',
    categoryId: '',
  });

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onChangeCategory = (value) => {
    setForm((prev) => ({ ...prev, categoryId: value }));
  };

  const handleSearch = () => {
    dispatch({
      type: SEARCH_PROFILES_REQUEST,
      data: {
        name: form.aniName,
        categoryId: form.categoryId,
      },
    });
  };
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title="친구 찾기"
      footer={null}
      width={420}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Select
          placeholder="카테고리 선택"
          onChange={onChangeCategory}
          value={form.categoryId || undefined}
        >
          {categories
            .filter((v) => v.isAnimal)
            .map((v) => (
              <Option key={v.id} value={v.id}>
                {v.content}
              </Option>
            ))}
        </Select>

        <Input
          name="aniName"
          placeholder="이름 검색"
          value={form.aniName}
          onChange={onChange}
        />

        <Button type="primary" onClick={handleSearch} loading={searchProfilesLoading}>
          검색
        </Button>
      </div>

      <div style={{ marginTop: 24 }}>
        {searchProfilesLoading ? (
          <Spin />
        ) : (
          <List
            dataSource={searchResults}
            locale={{ emptyText: <Empty description="검색 결과 없음" /> }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`http://localhost:3065/uploads/animalProfile/${item.aniProfile}`}
                    />
                  }
                  title={item.aniName}
                  description={`${item.Category?.content} · ${item.aniAge}살`}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Modal>
  );
};

export default AnimalSearch;
