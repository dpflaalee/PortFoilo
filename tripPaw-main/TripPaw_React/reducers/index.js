import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

const dummy = (state = {}, action) => {
  return state;
};
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        dummy,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
