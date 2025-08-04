//component/checklist/ChecklistItemList.js
import { useEffect, useState } from 'react';
import { getTemplateWithItems } from '@/api/checkTemplate';

const ChecklistItemList = ({ templateId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getTemplateWithItems(templateId);
      if (Array.isArray(data)) {setItems(data);} 
      else if (data.items) {setItems(data.items);} 
      else {setItems([]); }
    };

    fetchItems();
  }, [templateId]);

  return (
    <ul style={{listStyle:'none', padding:'0 16px'}}>
      {items.map((item) => (
        <li style={{paddingBottom:'12px'}}
         key={item.id}> {item.content || item.name}</li>
      ))}
    </ul>
  );
};

export default ChecklistItemList;
