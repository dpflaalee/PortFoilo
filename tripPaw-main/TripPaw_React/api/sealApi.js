import axios from 'axios';

export const fetchAllSeals = () => axios.get('/api/seals');

export const fetchSealsByType = (placeTypeId) =>
  axios.get(`/api/seals/place-type/${placeTypeId}`);

export const createSeal = (seal) =>
  axios.post('/api/seals', seal);

export const updateSeal = (id, seal) =>
  axios.put(`/api/seals/${id}`, seal);

export const deleteSeal = (id) =>
  axios.delete(`/api/seals/${id}`);
