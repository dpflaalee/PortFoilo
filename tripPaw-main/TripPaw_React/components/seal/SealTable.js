import { Card, Col, Row } from 'antd';
import React from 'react';

const SealTable = ({ seals, onEdit, onDelete }) => (<>
  <div>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '24px' }}>
      {seals.map((seal) => (
        <div key={seal.id}
          style={{
            width: '180px', border: '1px solid #eee', borderRadius: '3px',
            padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
          }}
        >

          <div style={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#ffece4', width: '100%', textAlign: 'center', borderRadius: '16px', padding: '4px', color: '#653131' }}>{seal.placeType.name}</div>

          <div style={{ width: '100%', height: '120px', overflow: 'hidden', borderRadius: '4px', }}
          >
            <img src={seal.imageUrl} alt={seal.name} crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ fontSize: '15px', fontWeight: 'bold', textAlign: 'center' }}>{seal.name}</div>

          <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-between', width: '100%' }}>
            <button style={{ padding: '4px 8px', border: 'none', width: '100%', marginRight: '8px', fontWeight: 'bold', color: '#fff', backgroundColor: '#000', borderRadius: '3px', cursor: 'pointer' }}
              onClick={() => onEdit(seal)} >수정</button>
            <button style={{ padding: '4px 8px', width: '100%', fontWeight: 'bold', color: '#ff0000', backgroundColor: '#fff', borderRadius: '3px', cursor: 'pointer', border: '1px solid #000' }}
              onClick={() => onDelete(seal.id)} >삭제</button>
          </div>
        </div>
      ))}
    </div>

  </div>
</>);

export default SealTable;
