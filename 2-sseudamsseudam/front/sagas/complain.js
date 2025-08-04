import axios from 'axios';
import { all, fork, put, takeLatest, throttle, call } from 'redux-saga/effects';
import {
  LOAD_COMPLAIN_REQUEST, LOAD_COMPLAIN_SUCCESS, LOAD_COMPLAIN_FAILURE,
  ADD_COMPLAIN_REQUEST, ADD_COMPLAIN_SUCCESS, ADD_COMPLAIN_FAILURE,
  REMOVE_COMPLAIN_REQUEST, REMOVE_COMPLAIN_SUCCESS, REMOVE_COMPLAIN_FAILURE,
  IS_BLIND_REQUEST, IS_BLIND_SUCCESS, IS_BLIND_FAILURE
} from '../reducers/complain';

//////////////////////////////////////////////////////////
function loadComplainAPI() {
  return axios.get(`/admin/complain`);
}

function* loadComplain(action) {
  try {
    const result = yield call(loadComplainAPI, action.data);
    yield put({
      type: LOAD_COMPLAIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_COMPLAIN_FAILURE,
      error: err.response.data,
    });
  }
}



function addComplainAPI(data) {
  return axios.post('/complain', data);
}

function* addComplain(action) {
  try {
    const result = yield call(addComplainAPI, action.data);
    yield put({
      type: ADD_COMPLAIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: ADD_COMPLAIN_FAILURE,
      error: err.response.data,
    });
  }
}

function removeComplainAPI(data) {
  return axios.delete(`/admin/complain`);
}

function* removeComplain(action) {
  try {
    const result = yield call(removeComplainAPI, action.data);
    yield put({
      type: REMOVE_COMPLAIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_COMPLAIN_FAILURE,
      error: err.response.data,
    });
  }
}

////////////////////////////
function isBlindComplainAPI(data) {
  return axios.patch('/complain/blind', data);
}

function* isBlindComplain(action) {
  try {
    const result = yield call(isBlindComplainAPI, action.data);
    yield put({
      type: IS_BLIND_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: IS_BLIND_FAILURE,
      error: err.response.data,
    });
  }
}
///////////////////////////////////////////////////////


//////////////////////////
function* watchLoadComplain() {
  yield throttle(5000, LOAD_COMPLAIN_REQUEST, loadComplain);
}

function* watchAddComplain() {
  yield takeLatest(ADD_COMPLAIN_REQUEST, addComplain);
}

function* watchRemoveComplain() {
  yield takeLatest(REMOVE_COMPLAIN_REQUEST, removeComplain);
}

function* watchIsBlindComplain() {
  yield takeLatest(IS_BLIND_REQUEST, isBlindComplain);
}

/////////////////////
export default function* complainSaga() {
  yield all([  //  all - 동시에 배열로 받은 fork들을 동시에 실행 
    fork(watchLoadComplain),
    fork(watchAddComplain),
    fork(watchRemoveComplain),
    fork(watchIsBlindComplain),
  ]);
}
