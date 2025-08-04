import axios from 'axios';
import { all, fork, takeLatest, call, put } from 'redux-saga/effects';
import {
    LOAD_CATEGORIES_REQUEST,
    LOAD_CATEGORIES_SUCCESS,
    LOAD_CATEGORIES_FAILURE,
    ADD_CATEGORY_REQUEST,
    ADD_CATEGORY_SUCCESS,
    ADD_CATEGORY_FAILURE,
    EDIT_CATEGORY_REQUEST,
    EDIT_CATEGORY_SUCCESS,
    EDIT_CATEGORY_FAILURE,
} from '../reducers/category';

function loadCategoriesAPI() {
    return axios.get('/category');
}

function* loadCategories() {
    try {
        const result = yield call(loadCategoriesAPI);
        yield put({
            type: LOAD_CATEGORIES_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            type: LOAD_CATEGORIES_FAILURE,
            error: err.response?.data || err.message,
        });
    }
}

function addCategoryAPI(data) {
    return axios.post('/category', data);
}

function* addCategory(action) {
    try {
        const result = yield call(addCategoryAPI, action.data);
        yield put({
            type: ADD_CATEGORY_SUCCESS,
            data: result.data.category,
        });
    } catch (err) {
        yield put({
            type: ADD_CATEGORY_FAILURE,
            error: err.response?.data || err.message,
        });
    }
}

function editCategoryAPI(data) {
    return axios.patch(`/category/${data.id}`, data);
}

function* editCategory(action) {
    try {
        const result = yield call(editCategoryAPI, action.data);
        yield put({
            type: EDIT_CATEGORY_SUCCESS,
            data: result.data.category,
        });
    } catch (err) {
        yield put({
            type: EDIT_CATEGORY_FAILURE,
            error: err.response?.data || err.message,
        });
    }
}

function* watchLoadCategories() {
    yield takeLatest(LOAD_CATEGORIES_REQUEST, loadCategories);
}

function* watchAddCategory() {
    yield takeLatest(ADD_CATEGORY_REQUEST, addCategory);
}

function* watchEditCategory() {
    yield takeLatest(EDIT_CATEGORY_REQUEST, editCategory);
}

export default function* categorySaga() {
    yield all([
        fork(watchLoadCategories),
        fork(watchAddCategory),
        fork(watchEditCategory),
    ]);
}
