import { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, Space } from 'antd';
import { getAllItems, addItem, updateItem, deleteItem } from '@/api/checkTemplateItem';

const ChecklistItemManager = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchItems = async () => {
    const data = await getAllItems();
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editingItem) {
      await updateItem(editingItem.id, { ...editingItem, ...values });
    } else {
      await addItem(values);
    }
    setModalVisible(false);
    setEditingItem(null);
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue({ content: item.content });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    fetchItems();
  };

  const columns = [
    { title: '이름', dataIndex: 'content', key: 'content' }, 
    {
      title: '동작',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button style={{border:'none', color:'#0004ff'}}
          onClick={() => handleEdit(record)}>수정</Button>
          <Button style={{border:'none', color:'#ff0000'}}
          onClick={() => handleDelete(record.id)}>삭제</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{padding:'10px'}}>
      <div style={{display:'flex', justifyContent: 'space-between', borderBottom:'2px solid #653131', paddingBottom:'12px', marginBottom:'24px' , marginTop:64}}>
        <h3 style={{ marginBottom: 16, fontSize:'24px', fontWeight:'bold', color:'#653131'}}>전체 체크리스트 항목</h3>
        <Button style={{border:'none', backgroundColor:'#eee', fontWeight:'bold'}}
        onClick={() => { setModalVisible(true); form.resetFields(); }}>항목 추가</Button>
      </div>

      <Table columns={columns} dataSource={items} rowKey="id" pagination={{ pageSize: 8 }} showHeader={false} />
      <Modal
        open={modalVisible}  title={editingItem ? '항목 수정' : '항목 추가'} onOk={handleSubmit} onCancel={() => { setModalVisible(false); setEditingItem(null); }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="이름" name="content" rules={[{ required: true, message: '이름을 입력하세요' }]} >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChecklistItemManager;
