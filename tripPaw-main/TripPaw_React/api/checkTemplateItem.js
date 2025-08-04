// api/checkTemplateItem.js
import axios from '../components/util/axios';

const API_BASE = '/api/template-items';

export const getAllItems = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getItemsByMemberId = async (memberId) => {
  const res = await axios.get(`${API_BASE}/member/${memberId}`);
  return res.data;
};

export const addItem = async (item) => {
  await axios.post(API_BASE, item);
};

export const updateItem = async (id, item) => {
  await axios.put(`${API_BASE}/${id}`, item);
};

export const deleteItem = async (id) => {
  await axios.delete(`${API_BASE}/${id}`);
};
