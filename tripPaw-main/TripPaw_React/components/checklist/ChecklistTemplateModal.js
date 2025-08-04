import { Modal, Form, Input, Checkbox, message } from 'antd';
import { useEffect, useState } from 'react';
import { createTemplate, updateTemplate, getAllTemplateItems } from '@/api/checkTemplate';

const ChecklistTemplateModal = ({ visible, onClose, editingTemplate }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      const data = await getAllTemplateItems();
      setItems(data);
    } catch {
      message.error('항목 목록 조회 실패');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (editingTemplate) {
      form.setFieldsValue({
        title: editingTemplate.title,
        category: editingTemplate.category,
        selectedItemIds: editingTemplate.items?.map(i => i.id),
      });
    } else {
      form.resetFields();
    }
  }, [editingTemplate, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    const payload = {
      title: values.title,
      category: values.category,
      selectedItemIds: values.selectedItemIds,
    };

    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, payload);
        message.success('템플릿이 수정되었습니다.');
      } else {
        await createTemplate(payload);
        message.success('템플릿이 생성되었습니다.');
      }
      onClose();
    } catch {
      message.error('저장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingTemplate ? '📝 템플릿 수정' : '➕ 템플릿 생성'}
      open={visible}
      onOk={form.submit}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="title" label="제목" rules={[{ required: true, message: '제목을 입력하세요' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="카테고리">
          <Input />
        </Form.Item>
        <Form.Item name="selectedItemIds" label="항목 선택">
          <Checkbox.Group
            options={items.map((i) => ({ label: i.content || i.name, value: i.id }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChecklistTemplateModal;
