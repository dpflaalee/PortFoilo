//항목 추가 버튼과 입력창
import { useState } from 'react';
import { Button, Modal, Input, Form, message } from 'antd';
import { addMemberCheck } from '@/api/memberCheck';

const ChecklistItemAdder = ({ routineId, onRefresh }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      const newMemberCheck = {
        customContent: values.customContent,
        isChecked: false, checkRoutine: { id: routineId },
      };

      await addMemberCheck(newMemberCheck);
      message.success('항목이 추가되었습니다.');
      form.resetFields();
      setVisible(false);
      onRefresh();
    } catch (err) {
      message.error('항목 추가 실패');
    }
  };

  return (
    <>
      <div style={{ marginTop: 12, display:'flex' }}>
        <Button onClick={() => setVisible(true)}
          style={{width:'100%', fontWeight:'bold', color:'#0004FF', border:'none', textAlign:'right'}}
        >항목 추가</Button>
      </div>

      <Modal open={visible} title="새 항목 추가" onOk={handleAdd}  onCancel={() => setVisible(false)} >
        <Form form={form} layout="vertical">
          <Form.Item  label="내용" name="customContent"
            rules={[{ required: true, message: '내용을 입력하세요' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChecklistItemAdder;
