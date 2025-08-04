///api/checkRoutine
import axios from 'axios';
const BASE_URL = '/api/routine';

export const createRoutine = async (routine) =>
  axios.post(`${BASE_URL}`, routine).then(res => res.data);

export const getRoutineWithItems = async (routineId) =>
  axios.get(`${BASE_URL}/${routineId}`).then(res => res.data);

export const getRoutinesByMemberId = async (memberId) =>
  axios.get(`${BASE_URL}/member/${memberId}`).then(res => res.data);

export const updateRoutine = async (id, routine) =>
  axios.put(`${BASE_URL}/${id}`, routine).then(res => res.status);

export const deleteRoutine = async (id) =>
  axios.delete(`${BASE_URL}/${id}`).then(res => res.status);

export const getRoutinesByTripPlan = async (memberId, tripPlanId) =>
  axios.get(`${BASE_URL}/member/${memberId}/trip/${tripPlanId}`).then(res => res.data);

