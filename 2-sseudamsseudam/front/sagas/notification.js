import axios from 'axios';
import { all, fork, put, takeLatest, throttle, call } from 'redux-saga/effects';
import {
    LOAD_NOTIFICATION_REQUEST, LOAD_NOTIFICATION_SUCCESS, LOAD_NOTIFICATION_FAILURE,
    READ_ALL_NOTIFICATION_REQUEST, READ_ALL_NOTIFICATION_SUCCESS, READ_ALL_NOTIFICATION_FAILURE,
    ADD_NOTIFICATION_REQUEST, ADD_NOTIFICATION_SUCCESS, ADD_NOTIFICATION_FAILURE,
    REMOVE_NOTIFICATION_REQUEST, REMOVE_NOTIFICATION_SUCCESS, REMOVE_NOTIFICATION_FAILURE,
} from '../reducers/notification';

//////////////////////////////////////////////////////////
function loadNotificationAPI(userId) {
    return axios.get('/notification', {
        params: { userId },
    });
}

function* loadNotification(action) {
    try {
        const result = yield call(loadNotificationAPI, action.data);
        yield put({
            type: LOAD_NOTIFICATION_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            type: LOAD_NOTIFICATION_FAILURE,
            error: err.response.data,
        });
    }
}

/////////////////////////////////////////
function readAllNotificationAPI(userId) {
    return axios.patch('/notification/readAll', { userId });
}

function* readAllNotification(action) {
    try {
        yield call(readAllNotificationAPI, action.data);
        yield put({
            type: READ_ALL_NOTIFICATION_SUCCESS,
        });
    } catch (err) {
        yield put({
            type: READ_ALL_NOTIFICATION_FAILURE,
            error: err.response?.data,
        });
    }
}

/////////////////////////////////////////
function addNotificationAPI(data) {
    return axios.post('/notification', data); // 
}

function* addNotification(action) {
    try {
        const result = yield call(addNotificationAPI, action.data);
        yield put({
            type: ADD_NOTIFICATION_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            type: ADD_NOTIFICATION_FAILURE,
            error: err.response.data,
        });
    }
}

function removeNotificationAPI(id) {
    return axios.delete(`/notification/${id}`);
}

function* removeNotification(action) {
    try {
        yield call(removeNotificationAPI, action.data);
        yield put({
            type: REMOVE_NOTIFICATION_SUCCESS,
            data: action.data,
        });
    } catch (err) {
        yield put({
            type: REMOVE_NOTIFICATION_FAILURE,
            error: err.response.data,
        });
    }
}
///////////////////////////////////////////////////////


//////////////////////////
function* watchLoadNotification() {
    yield throttle(5000, LOAD_NOTIFICATION_REQUEST, loadNotification);
}

function* watchReadAllNotification() {
    yield takeLatest(READ_ALL_NOTIFICATION_REQUEST, readAllNotification);
}

function* watchAddNotification() {
    yield takeLatest(ADD_NOTIFICATION_REQUEST, addNotification);
}

function* watchRemoveNotification() {
    yield takeLatest(REMOVE_NOTIFICATION_REQUEST, removeNotification);
}

/////////////////////
export default function* notificationSaga() {
    yield all([  //  all - 동시에 배열로 받은 fork들을 동시에 실행 
        fork(watchLoadNotification),
        fork(watchReadAllNotification),
        fork(watchAddNotification),
        fork(watchRemoveNotification),
    ]);
}
