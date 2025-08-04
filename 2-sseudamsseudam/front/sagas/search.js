import axios from 'axios';
import { all, fork, put, takeLatest, throttle, call } from 'redux-saga/effects';
import {
    SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_FAILURE
} from './reducers/search';

//////////////////////////////////////////////////////////
function searchAPI() {
    return axios.get(`/search/${data.searchInput}`);
}

function* search(action) {
    try {
        const result = yield call(searchAPI, action.data);
        yield put({
            type: SEARCH_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        next(err);
        yield put({
            type: SEARCH_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchSearch() {
    yield takeLatest(SEARCH_REQUEST, search);
}

/////////////////////
export default function* searchSaga() {
    yield all([  //  all - 동시에 배열로 받은 fork들을 동시에 실행 
        fork(watchSearch),
    ]);
}
