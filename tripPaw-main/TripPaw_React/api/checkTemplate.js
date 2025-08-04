// api/checkTemplate.js
import axios from '../components/util/axios';

const API_BASE = '/api/check-templates';

export const getTemplates = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getTemplateWithItems = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const getTemplateDetail = async (id) => {
  await axios.post(`${API_BASE}/${id}`);
};

export const createTemplate = async (data) => {
  await axios.post(API_BASE, data);
};

export const updateTemplate = async (id, data) => {
  await axios.put(`${API_BASE}/${id}`, data);
};

export const deleteTemplate = async (id) => {
  await axios.delete(`${API_BASE}/${id}`);
};

export const getAllTemplateItems = async () => {
  const res = await axios.get(`${API_BASE}/items/all`);
  return res.data;
};
