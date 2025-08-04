import React, { useState, useEffect } from 'react';
import { useSelector, } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Space, Form, Input, Select, Checkbox, Button, Typography, message, notification } from 'antd';

const { TextArea } = Input; const { Option } = Select;

const GroupForm = ({ initialValues = {}, onFinish, mode = 'create', groupId }) => {
  const [form] = Form.useForm(); 
  const router = useRouter(); 
  //const { groupId } = router.query;
  const { createGroupLoading, updateGroupLoading } = useSelector((state) => state.group);
  const [animalCategories, setCategoryOptions] = useState([]);

  useEffect(()=>{
    if(initialValues){
      form.setFieldsValue({
        title: '',
        categories: [],
        content: '',
        isPrivate: false,
        ...initialValues,
      });
    }
  }, [initialValues]);

  const handleFinish = (values) => {
    const categoryIds = values.categories;
    const openScopeId = values.isPrivate ? 2 : 1;

    const payload = { title: values.title, content: values.content, categoryIds, openScopeId };
    onFinish(mode === 'edit' ? { ...payload, groupId } : payload);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/category');
        const animalCategories = res.data.filter(category => category.isAnimal);
        setCategoryOptions(animalCategories);
      } catch (err) {  message.error('카테고리를 불러오지 못했습니다.');      }
    };
    fetchCategories();
  }, []);

  

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ title: '', categories: [], content: '', isPrivate: false, ...initialValues }}
    >
      <Form.Item
        label="그룹명"
        name="title"
        rules={[{ required: true, message: '그룹명을 입력해주세요.' }]}
      >
        <Input placeholder="예: 러닝 메이트" />
      </Form.Item>

      <Form.Item
        label="카테고리"
        name="categories"
        rules={[{ required: true, message: '카테고리를 하나 이상 선택해주세요.' }]}
      >
        <Select mode="multiple" placeholder="카테고리를 선택하세요">
          {animalCategories.map((cat) => (
            <Option key={cat.id} value={cat.id}>{cat.content}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="소개 및 규칙"
        name="content"
        rules={[{ required: true, message: '소개 및 규칙을 입력해주세요.' }]}
      >
        <TextArea rows={5} placeholder="그룹 소개 및 규칙을 입력하세요" />
      </Form.Item>

      <Form.Item name="isPrivate" valuePropName="checked">
        <Checkbox>비공개 그룹으로 설정</Checkbox>
      </Form.Item>

      <Form.Item>
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => router.back('/groups')}>취소</Button>
          <Button type="primary" htmlType="submit" loading={mode === 'edit' ? updateGroupLoading : createGroupLoading}>
            {mode === 'edit' ? '그룹 수정' : '그룹 생성'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default GroupForm;
