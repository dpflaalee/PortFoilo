// components/checklist/ChecklistTemplateLayout.js
import { Divider } from 'antd';

export default function ChecklistTemplateLayout({ title, headerActions, children }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>{title}</h2>
        {headerActions}
      </div>
      <Divider />
      {children}
    </div>
  );
}
