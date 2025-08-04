import axios from 'axios';
import { all, fork, takeLatest, call, put } from 'redux-saga/effects';
import {
    LOAD_NOTIFICATION_SETTING_REQUEST,
    LOAD_NOTIFICATION_SETTING_SUCCESS,
    LOAD_NOTIFICATION_SETTING_FAILURE,
    UPDATE_NOTIFICATION_SETTING_REQUEST,
    UPDATE_NOTIFICATION_SETTING_SUCCESS,
    UPDATE_NOTIFICATION_SETTING_FAILURE,
} from '../reducers/notificationSetting';

// load
function loadNotificationSettingAPI(userId) {
    return axios.get(`/notificationSetting/${userId}`);
}

function* loadNotificationSetting(action) {
    try {
        const result = yield call(loadNotificationSettingAPI, action.data);
        yield put({
            type: LOAD_NOTIFICATION_SETTING_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            type: LOAD_NOTIFICATION_SETTING_FAILURE,
            error: err.response?.data || err.message,
        });
    }
}

// update
function updateNotificationSettingAPI(data) {
    return axios.patch('/notification-setting', data);
}

function* updateNotificationSetting(action) {
    try {
        yield call(updateNotificationSettingAPI, action.data);
        yield put({
            type: UPDATE_NOTIFICATION_SETTING_SUCCESS,
            data: action.data,
        });
    } catch (err) {
        yield put({
            type: UPDATE_NOTIFICATION_SETTING_FAILURE,
            error: err.response?.data || err.message,
        });
    }
}

function* watchLoadNotificationSetting() {
    yield takeLatest(LOAD_NOTIFICATION_SETTING_REQUEST, loadNotificationSetting);
}

function* watchUpdateNotificationSetting() {
    yield takeLatest(UPDATE_NOTIFICATION_SETTING_REQUEST, updateNotificationSetting);
}

export default function* notificationSettingSaga() {
    yield all([
        fork(watchLoadNotificationSetting),
        fork(watchUpdateNotificationSetting),
    ]);
}
