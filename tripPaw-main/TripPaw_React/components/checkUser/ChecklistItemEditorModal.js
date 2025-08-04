//항목 수정 모달
import { useEffect } from 'react';
import { Modal, Input, Form, message } from 'antd';
import { updateMemberCheck } from '@/api/memberCheck';

const ChecklistItemEditorModal = ({ item, visible, onClose }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && item) {
      form.setFieldsValue({
        customContent: item.customContent || '',
      }); 
    }
  }, [visible, item, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedItem = { ...item, customContent: values.customContent };
      await updateMemberCheck(item.id, updatedItem);
      message.success('항목이 수정되었습니다.');
      onClose();
    } catch (err) { message.error('수정 실패');  }
  };

  return (
    <Modal open={visible} title="항목 수정"  onOk={handleSubmit}  onCancel={onClose} >
      <Form form={form} layout="vertical">
        <Form.Item label="내용" name="customContent" rules={[{ required: true, message: '내용을 입력해주세요' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChecklistItemEditorModal;
