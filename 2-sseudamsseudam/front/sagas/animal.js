import {all, put, takeLatest, call, fork} from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_ANIPROFILE_REQUEST,
  ADD_ANIPROFILE_SUCCESS,
  ADD_ANIPROFILE_FAILURE,
  LOAD_ANIMAL_PROFILE_REQUEST,
  LOAD_ANIMAL_PROFILE_SUCCESS,
  LOAD_ANIMAL_PROFILE_FAILURE,
  LOAD_ANIMAL_LIST_REQUEST,
  LOAD_ANIMAL_LIST_SUCCESS,
  LOAD_ANIMAL_LIST_FAILURE,
  REMOVE_ANIFOLLOW_REQUEST,
  REMOVE_ANIFOLLOW_SUCCESS,
  REMOVE_ANIFOLLOW_FAILURE,
  LOAD_ANIFOLLOWERS_REQUEST,
  LOAD_ANIFOLLOWERS_SUCCESS,
  LOAD_ANIFOLLOWERS_FAILURE,
  LOAD_ANIFOLLOWINGS_REQUEST,
  LOAD_ANIFOLLOWINGS_SUCCESS,
  LOAD_ANIFOLLOWINGS_FAILURE,
  REMOVE_ANIPROFILE_REQUEST,
  REMOVE_ANIPROFILE_SUCCESS,
  REMOVE_ANIPROFILE_FAILURE,
  LOAD_RECOMMENDED_ANIMALS_REQUEST,
  LOAD_RECOMMENDED_ANIMALS_SUCCESS,
  LOAD_RECOMMENDED_ANIMALS_FAILURE,
  ANIFOLLOW_REQUEST,
  ANIFOLLOW_SUCCESS,
  ANIFOLLOW_FAILURE,
  ANIUNFOLLOW_REQUEST,
  ANIUNFOLLOW_SUCCESS,
  ANIUNFOLLOW_FAILURE,
  MODIFY_ANIPROFILE_REQUEST,
  MODIFY_ANIPROFILE_SUCCESS,
  MODIFY_ANIPROFILE_FAILURE,
  SEARCH_PROFILES_REQUEST,
  SEARCH_PROFILES_SUCCESS,
  SEARCH_PROFILES_FAILURE,
  LOAD_USER_ANIMAL_LIST_REQUEST,
  LOAD_USER_ANIMAL_LIST_SUCCESS,
  LOAD_USER_ANIMAL_LIST_FAILURE
} from '../reducers/animal';

import { ADD_NOTIFICATION_REQUEST } from '@/reducers/notification';
import NOTIFICATION_TYPE from '../../shared/constants/NOTIFICATION_TYPE';

function addAniProfileAPI(formData) {
  return axios.post('/animal/animalform', formData);
}
function * addAniProfile(action) {
  try {
    const result = yield call(addAniProfileAPI, action.data);
    yield put({
      type: ADD_ANIPROFILE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: ADD_ANIPROFILE_FAILURE,
      error: err.response.data || err.message,
    });
  }
}

function loadAnimalProfileAPI(id) {
  return axios.get(`/animal/${id}`);
}
function* loadAnimalProfile(action) {
  try {
    const result = yield call(loadAnimalProfileAPI, action.data);
    yield put({ type: LOAD_ANIMAL_PROFILE_SUCCESS, data: result.data });
  } catch (err) {
    yield put({ type: LOAD_ANIMAL_PROFILE_FAILURE, error: err.response?.data || err.message });
  }
}

function loadMyAnimalsAPI() {
  return axios.get('/animal/my', { withCredentials: true });
}
function* loadMyAnimals() {
  try {
    const result = yield call(loadMyAnimalsAPI);
    yield put({type: LOAD_ANIMAL_LIST_SUCCESS, data: result.data});
  } catch (err) {
    yield put({type: LOAD_ANIMAL_LIST_FAILURE, error: err.response.data});
  }
}

function loadUserAnimalListAPI(userId) {
  return axios.get(`/animal/user/${userId}`);
}
function* loadUserAnimalList(action) {
  try {
    const result = yield call(loadUserAnimalListAPI, action.data)
    yield put({
      type: LOAD_USER_ANIMAL_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_USER_ANIMAL_LIST_FAILURE,
      error: err.response?.data || err.message,
    });
  }
}

function removeAniProfileAPI(id) {
  return axios.delete(`/animal/${id}`, {
    withCredentials: true,
  });
}
function* removeAniProfile(action) {
  try {
    const result = yield call(removeAniProfileAPI, action.data);
    yield put({
      type: REMOVE_ANIPROFILE_SUCCESS,
      data: result.data.animalId, 
    });
  } catch (err) {
    yield put({
      type: REMOVE_ANIPROFILE_FAILURE,
      error: err.response?.data || err.message,
    });
  }
}

function loadAniFollowersAPI(id) {
  return axios.get(`/animal/${id}/followers`);
}
function* loadAniFollowers(action) {
  try {
    const result = yield call(loadAniFollowersAPI, action.data);
    yield put({
      type: LOAD_ANIFOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_ANIFOLLOWERS_FAILURE,
      error: err.response?.data || err.message,
    });
  }
}

function loadAniFollowingsAPI(id) {
  return axios.get(`/animal/${id}/followings`);
}
function* loadAniFollowings(action) {
  try {
    const result = yield call(loadAniFollowingsAPI, action.data);
    yield put({
      type: LOAD_ANIFOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_ANIFOLLOWINGS_FAILURE,
      error: err.response?.data || err.message,
    });
  }
}

function aniFollowAPI({ targetAnimalId, myAnimalId }) {
  return axios.patch(`/animal/${targetAnimalId}/follow`, { myAnimalId });
}
function* aniFollow(action) {
  try {
    const response = yield call(aniFollowAPI, action.data);
    yield put({
      type: ANIFOLLOW_SUCCESS,
      data: {
        ...response.data,
        followedId: action.data.targetAnimalId,
      },
    });
    
    // 🐕‍🦺 동물 ID → 유저 ID 변환
    const [senderRes, receiverRes] = yield all([
      call(axios.get, `/animal/${action.data.myAnimalId}`),
      call(axios.get, `/animal/${action.data.targetAnimalId}`),
    ]);

    const senderUserId = senderRes.data.animal?.User?.id;
    const receiverUserId = receiverRes.data.animal?.User?.id;
    if (senderUserId && receiverUserId) {
      yield put({
        type: ADD_NOTIFICATION_REQUEST,
        data: {
          notiType: NOTIFICATION_TYPE.ANIMAL_FRIENDS,
          SenderId: senderUserId,
          ReceiverId: receiverUserId,
          targetId: action.data.targetAnimalId,
        },
      });
    } else {
    }

  } catch (err) {
    yield put({
      type: ANIFOLLOW_FAILURE,
      error: err.response?.data || err.message,
    });
  }
}

function aniUnFollowAPI({ targetAnimalId, myAnimalId }) {
  return axios.delete(`/animal/${targetAnimalId}/follow`, {
    data: { myAnimalId },
  });
}
function* aniUnFollow(action) {
  try {
    const response = yield call(aniUnFollowAPI, action.data);
    yield put({
      type: ANIUNFOLLOW_SUCCESS,
      data: {
        ...response.data,
        unfollowedId: action.data.targetAnimalId,
      },
    });
  } catch (err) {
    yield put({
      type: ANIUNFOLLOW_FAILURE,
      error: err.response?.data || err.message,
    });
  }
}

function removeAniFollowAPI(data) {
  return axios.delete(`/animal/${data.animalId}/follower`, {
    data: { targetAnimalId: data.targetAnimalId },
  });
}
function* removeAniFollow(action) {
  try {
    const result = yield call(removeAniFollowAPI, action.data);
    yield put({ type: REMOVE_ANIFOLLOW_SUCCESS, data: result.data });
  } catch (err) {
    yield put({ 
      type: REMOVE_ANIFOLLOW_FAILURE, error: err.response?.data || err.message 
    });
  }
}

function loadRecommendedAnimalsAPI(id) {
  return axios.get(`/animal/${id}/recommendations`);
}
function* loadRecommendedAnimals(action) {
  try {
    const result = yield call(loadRecommendedAnimalsAPI, action.data);
    yield put({ type: LOAD_RECOMMENDED_ANIMALS_SUCCESS, data: result.data });
  } catch (err) {
    yield put({ type: LOAD_RECOMMENDED_ANIMALS_FAILURE, error: err.response?.data });
  }
}

function modifyAniprofileAPI({ id, formData }) {
  return axios.patch(`/animal/${id}`, formData);
}
function* modifyAniprofile(action) {
  try {
    const result = yield call(modifyAniprofileAPI, action.data);
    yield put({
      type: MODIFY_ANIPROFILE_SUCCESS,
      data: result.data.animal,
    });
  } catch (err) {
    yield put({
      type: MODIFY_ANIPROFILE_FAILURE,
      error: err.response?.data || err.message,
    });
  }
}

function searchProfilesAPI(data){
  const {name, categoryId} = data
  return axios.get(`/animal/search`, {
    params: {name, categoryId},
  });
}
function* searchProfiles(action){
  try {
    const result = yield call(searchProfilesAPI, action.data);
    yield put({
      type: SEARCH_PROFILES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: SEARCH_PROFILES_FAILURE,
      error: err.response?.data || err.message,
    });
  }
}

function* watchAddAniProfile() {
  yield takeLatest(ADD_ANIPROFILE_REQUEST, addAniProfile);
}
function* watchLoadMyAnimals(){
  yield takeLatest(LOAD_ANIMAL_LIST_REQUEST, loadMyAnimals);
}
function* watchLoadAnimalProfile() {
  yield takeLatest(LOAD_ANIMAL_PROFILE_REQUEST, loadAnimalProfile);
}
function* watchLoadAniFollowers() {
  yield takeLatest(LOAD_ANIFOLLOWERS_REQUEST, loadAniFollowers);
}
function* watchLoadAniFollowings() {
  yield takeLatest(LOAD_ANIFOLLOWINGS_REQUEST, loadAniFollowings);
}
function* watchRemoveAniProfile() {
  yield takeLatest(REMOVE_ANIPROFILE_REQUEST, removeAniProfile);
}
function* watchLoadRecommendedAnimals() {
  yield takeLatest(LOAD_RECOMMENDED_ANIMALS_REQUEST, loadRecommendedAnimals);
}
function* watchAniFollow(){
  yield takeLatest(ANIFOLLOW_REQUEST, aniFollow);
}
function* watchAniUnFollow(){
  yield takeLatest(ANIUNFOLLOW_REQUEST, aniUnFollow);
}
function* watchModifyAniprofile() {
  yield takeLatest(MODIFY_ANIPROFILE_REQUEST, modifyAniprofile);
}
function* watchRemoveAniFollow() {
  yield takeLatest(REMOVE_ANIFOLLOW_REQUEST, removeAniFollow);
}
function* watchSearchProfiles() {
  yield takeLatest(SEARCH_PROFILES_REQUEST, searchProfiles);
}
function* watchLoadUserAnimalList() {
  yield takeLatest(LOAD_USER_ANIMAL_LIST_REQUEST, loadUserAnimalList);
}
export default function* animalSaga() {
  yield all([
    fork(watchAddAniProfile),
    fork(watchLoadAnimalProfile),
    fork(watchRemoveAniProfile),
    fork(watchLoadAniFollowers),
    fork(watchLoadAniFollowings),
    fork(watchLoadRecommendedAnimals),
    fork(watchAniFollow),
    fork(watchAniUnFollow),
    fork(watchLoadMyAnimals),
    fork(watchModifyAniprofile),
    fork(watchRemoveAniFollow),
    fork(watchSearchProfiles),
    fork(watchLoadUserAnimalList),
  ]);
}
