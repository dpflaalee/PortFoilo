import React, { useEffect, useState } from 'react';
import { fetchAllSeals, deleteSeal } from '@/api/sealApi';
import SealTable from '@/components/seal/SealTable';
import SealEditorModal from '@/components/seal/SealEditorModal';
import MypageLayout from '@/components/layout/MyPageLayout';

const SealAdminPage = () => {
  const [seals, setSeals] = useState([]);
  const [selectedSeal, setSelectedSeal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadSeals = () => {
    fetchAllSeals().then(res => setSeals(res.data));
  };

  useEffect(() => { loadSeals(); }, []);

  const handleEdit = (seal) => {
    setSelectedSeal(seal);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteSeal(id).then(loadSeals);
    }
  };

  return (
    <MypageLayout>
      <div style={{padding:'2em'}}>
      <div style={{display:'flex', justifyContent: 'space-between', borderBottom:'2px solid #653131', paddingBottom:'12px', marginBottom:'24px'  }}>
        <h2 style={{ marginBottom: 16, fontSize:'24px', fontWeight:'bold', color:'#653131'}}>도장 관리</h2>
        <button  style={{border:'none', backgroundColor:'#eee', fontWeight:'bold', padding:'0 18px', borderRadius:'5px'}} 
        onClick={() => { setSelectedSeal(null); setShowModal(true); }}>도장 추가</button>
      </div>
      <SealTable seals={seals} onEdit={handleEdit} onDelete={handleDelete} />
      {showModal && (
        <SealEditorModal
          seal={selectedSeal}
          onClose={() => setShowModal(false)}
          onSaved={loadSeals}
        />
      )}
      </div>
    </MypageLayout>
  );
};

export default SealAdminPage;
