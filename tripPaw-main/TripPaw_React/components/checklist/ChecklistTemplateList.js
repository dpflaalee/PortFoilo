//components/checklist/CheckTemplateList.js
import { useEffect, useState } from 'react';
import { Collapse, Button, message } from 'antd';
import { getTemplates, deleteTemplate } from '@/api/checkTemplate';
import ChecklistItemList from './ChecklistItemList';
import ChecklistTemplateModal from './ChecklistTemplateModal';
import TemplateActionButtons from './TemplateActionButtons';

const ChecklistTemplateList = ({ isAdmin }) => {
  const [templates, setTemplates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [loading, setLoading] = useState(false); 

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (err) {
      message.error('템플릿 목록을 불러오는 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTemplate(id);
      message.success('템플릿이 삭제되었습니다.');
      fetchTemplates();
    } catch (err) {
      message.error('삭제 실패');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingTemplate(null);
    fetchTemplates();
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div style={{padding:'10px'}}>
      <div style={{display:'flex', justifyContent: 'space-between', borderBottom:'2px solid #653131', paddingBottom:'12px', marginBottom:'24px'  }}>
        <h3 style={{ marginBottom: 16, fontSize:'24px', fontWeight:'bold', color:'#653131'}}>체크리스트 템플릿</h3>
        <Button  style={{border:'none', backgroundColor:'#eee', fontWeight:'bold'}}
        onClick={() => setModalVisible(true)}>템플릿 생성</Button>
      </div>

      <Collapse accordion style={{ background: 'transparent', border: 'none', padding:'0 16px' }}>
        {templates.map((template) => (
          <Collapse.Panel style={{border:'none'}}  key={template.id}
           header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight:'bold', fontSize:'16px'}}>
              <div>{template.title}</div>
              <TemplateActionButtons template={template} onEdit={setEditingTemplate} onOpenModal={() => setModalVisible(true)} onDelete={handleDelete} />
            </div>
            } >  
            <ChecklistItemList templateId={template.id} isAdmin={isAdmin} />
          </Collapse.Panel>
        ))}
      </Collapse>

      <ChecklistTemplateModal visible={modalVisible} onClose={handleModalClose} editingTemplate={editingTemplate} />
    </div>
  );
};

export default ChecklistTemplateList;
