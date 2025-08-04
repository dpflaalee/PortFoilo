import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import postSaga from './post';
import complainSaga from './complain';
import userSaga from './user';
import notificationSaga from './notification';
import animalSaga from './animal';
import prizeSaga from './prize';
import myPrizeSaga from './myPrize';
import groupSaga from './group';
import notificationSettingSaga from './notificationSetting';
import categorySaga from './category';

axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([
    fork(postSaga),
    fork(complainSaga),
    fork(userSaga),
    fork(notificationSaga),
    fork(animalSaga),
    fork(groupSaga),
    fork(prizeSaga),
    fork(myPrizeSaga),
    fork(notificationSettingSaga),
    fork(categorySaga),
  ]);
}
