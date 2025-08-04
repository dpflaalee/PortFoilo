import { Modal, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { updateRoutine } from '@/api/checkRoutine';

const RoutineEditorModal = ({ routine, visible, onClose }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && routine) {
      form.setFieldsValue({ title: routine.title || '' });
    }
  }, [visible, routine, form]);

  const handleUpdate = async () => { 
    try {
      const values = await form.validateFields();
      const updated = { ...routine, title: values.title, isSaved: routine.isSaved };
      await updateRoutine(routine.id, updated);
      message.success('루틴 제목이 수정되었습니다.');
      onClose();
    } catch (err) {
      message.error('루틴 수정 실패');
    }
  };

  return (
    <Modal open={visible} title="루틴 제목 수정" onOk={handleUpdate} onCancel={onClose} >
      <Form form={form} layout="vertical">
        <Form.Item label="루틴 제목" name="title" rules={[{ required: true, message: '제목을 입력하세요' }]} >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
    
  );
};

export default RoutineEditorModal;
