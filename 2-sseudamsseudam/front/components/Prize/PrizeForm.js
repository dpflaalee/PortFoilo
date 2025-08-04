import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;

const PrizeForm = ({ open, onCancel, onSubmit, editingPrize, categories }) => {
  const [form] = Form.useForm();
  const isEditing = !!editingPrize;

  useEffect(() => {
    if (editingPrize) {
      form.setFieldsValue({
        ...editingPrize,
        dueAt: editingPrize.dueAt ? moment(editingPrize.dueAt) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingPrize, form]);

  const handleFinish = (values) => {
    const formatted = {
      ...values,
      dueAt: values.dueAt.format('YYYY-MM-DD'),
      CategoryId: values.categoryId,
    };

    if (isEditing) {
      formatted.id = editingPrize.id;
    }

    onSubmit(formatted);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={isEditing ? '상품 수정' : '상품 추가'}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      okText={isEditing ? '수정하기' : '추가하기'}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="categoryId"
          label="카테고리"
          rules={[{ required: true, message: '카테고리는 필수로 입력하셔야 합니다.' }]}
        >
          <Select placeholder="카테고리를 선택하세요">
            {categories.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.content}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="상품명"
          rules={[{ required: true, message: '상품명은 필수로 입력하셔야 합니다.' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="수량"
          rules={[{ required: true, message: '수량은 필수로 입력하셔야 합니다.' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="probability"
          label="확률 (%)"
          rules={[{ required: true, message: '확률은 필수로 입력하셔야 합니다.' }]}
        >
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="dueAt"
          label="만료일"
          rules={[{ required: true, message: '만료일은 필수로 입력하셔야 합니다.' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PrizeForm;
