import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import post from './post';
import user from './user';
import complain from './complain';
import animal from './animal';
import notification from './notification';
import group from './group';
import prize from './prize';
import myPrize from './myPrize';
import notificationSetting from './notificationSetting';
import category from './category';

// (이전상태, 액션) => 다음상태
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
        complain,
        animal,
        notification,
        prize,
        myPrize,
        group,
        notificationSetting,
        category
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;