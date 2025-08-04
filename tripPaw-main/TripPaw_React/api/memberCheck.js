///api/memberCheck
import axios from 'axios';
const BASE_URL = '/api/member-checks';

export const getMemberChecksByRoutineId = async (routineId) =>
  axios.get(`${BASE_URL}/routine/${routineId}`).then(res => res.data);

export const getMemberChecksByMemberId = async (memberId) =>
  axios.get(`${BASE_URL}/member/${memberId}`).then(res => res.data);

export const getMemberChecksByRouteId = async (routeId) =>
  axios.get(`${BASE_URL}/route/${routeId}`).then(res => res.data);

export const getRoutineWithItems = async (routineId) =>
  axios.get(`${BASE_URL}/routine/detail/${routineId}`).then(res => res.data);

export const getRoutinesByMember = async (memberId) =>
  axios.get(`${BASE_URL}/routines/member/${memberId}`).then(res => res.data);

export const addMemberCheck = async (memberCheck) =>
  axios.post(`${BASE_URL}`, memberCheck).then(res => res.status);

export const updateMemberCheck = async (id, memberCheck) =>
  axios.put(`${BASE_URL}/${id}`, memberCheck).then(res => res.status);

export const deleteMemberCheck = async (id) =>
  axios.delete(`${BASE_URL}/${id}`).then(res => res.status);

export const createRoutineFromTemplates = async (payload) =>
  axios.post(`${BASE_URL}/routine/from-templates`, payload).then(res => res.data);
