import axios from 'axios';

export const createPassport = (passportData) =>
  axios.post('/api/passports', passportData);

export const getPassportById = (passportId) =>
  axios.get(`/api/passports/${passportId}`);

export const getPassportsByMemberId = (memberId) =>
  axios.get(`/api/passports/member/${memberId}`);

export const getPassportWithSeals = (passportId) =>
  axios.get(`/api/passports/${passportId}/seals`);

export const updatePassport = (passportId, passportData) =>
  axios.put(`/api/passports/${passportId}`, passportData);

export const deletePassport = (passportId) =>
  axios.delete(`/api/passports/${passportId}`);

export const checkPassNumDuplicate = (passNum) =>
  axios.get(`/api/passports/check-passnum`, { params: { passNum } });
