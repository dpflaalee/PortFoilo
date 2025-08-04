import produce from 'immer';

export const initialState = {
  prizes: [],
  randomBoxes: [],  // 랜덤박스 리스트 분리 (추가)

  addPrizeLoading: false,
  addPrizeDone: false,
  addPrizeError: null,

  loadPrizesLoading: false,
  loadPrizesDone: false,
  loadPrizesError: null,

  modifyPrizeLoading: false,
  modifyPrizeDone: false,
  modifyPrizeError: null,

  removePrizeLoading: false,
  removePrizeDone: false,
  removePrizeError: null,

  openRandomBoxLoading: false,
  openRandomBoxDone: false,
  openRandomBoxError: null,

  loadRandomBoxListLoading: false,
  loadRandomBoxListDone: false,
  loadRandomBoxListError: null,

  issuedRandomBoxes: [],
  loadIssuedRandomBoxesLoading: false,
  loadIssuedRandomBoxesDone: false,
  loadIssuedRandomBoxesError: null,

};

export const ADD_PRIZE_REQUEST = 'ADD_PRIZE_REQUEST';
export const ADD_PRIZE_SUCCESS = 'ADD_PRIZE_SUCCESS';
export const ADD_PRIZE_FAILURE = 'ADD_PRIZE_FAILURE';

export const LOAD_PRIZES_REQUEST = 'LOAD_PRIZES_REQUEST';
export const LOAD_PRIZES_SUCCESS = 'LOAD_PRIZES_SUCCESS';
export const LOAD_PRIZES_FAILURE = 'LOAD_PRIZES_FAILURE';

export const MODIFY_PRIZE_REQUEST = 'MODIFY_PRIZE_REQUEST';
export const MODIFY_PRIZE_SUCCESS = 'MODIFY_PRIZE_SUCCESS';
export const MODIFY_PRIZE_FAILURE = 'MODIFY_PRIZE_FAILURE';

export const REMOVE_PRIZE_REQUEST = 'REMOVE_PRIZE_REQUEST';
export const REMOVE_PRIZE_SUCCESS = 'REMOVE_PRIZE_SUCCESS';
export const REMOVE_PRIZE_FAILURE = 'REMOVE_PRIZE_FAILURE';

export const OPEN_RANDOM_BOX_REQUEST = 'OPEN_RANDOM_BOX_REQUEST';
export const OPEN_RANDOM_BOX_SUCCESS = 'OPEN_RANDOM_BOX_SUCCESS';
export const OPEN_RANDOM_BOX_FAILURE = 'OPEN_RANDOM_BOX_FAILURE';

export const LOAD_RANDOM_BOX_LIST_REQUEST = 'LOAD_RANDOM_BOX_LIST_REQUEST';
export const LOAD_RANDOM_BOX_LIST_SUCCESS = 'LOAD_RANDOM_BOX_LIST_SUCCESS';
export const LOAD_RANDOM_BOX_LIST_FAILURE = 'LOAD_RANDOM_BOX_LIST_FAILURE';

export const LOAD_ISSUED_RANDOM_BOXES_REQUEST = 'LOAD_ISSUED_RANDOM_BOXES_REQUEST';
export const LOAD_ISSUED_RANDOM_BOXES_SUCCESS = 'LOAD_ISSUED_RANDOM_BOXES_SUCCESS';
export const LOAD_ISSUED_RANDOM_BOXES_FAILURE = 'LOAD_ISSUED_RANDOM_BOXES_FAILURE';


const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch(action.type){
    case ADD_PRIZE_REQUEST:
      draft.addPrizeLoading = true;
      draft.addPrizeDone = false;
      draft.addPrizeError = null;
      break;
    case ADD_PRIZE_SUCCESS:
      draft.addPrizeLoading = false;
      draft.addPrizeDone = true;
      draft.prizes.push(action.data);
      break;
    case ADD_PRIZE_FAILURE:
      draft.addPrizeLoading = false;
      draft.addPrizeError = action.error;
      break;

    case LOAD_PRIZES_REQUEST:
      draft.loadPrizesLoading = true;
      draft.loadPrizesDone = false;
      draft.loadPrizesError = null;
      break;
    case LOAD_PRIZES_SUCCESS:
      draft.loadPrizesLoading = false;
      draft.loadPrizesDone = true;
      draft.prizes = action.data;
      break;
    case LOAD_PRIZES_FAILURE:
      draft.loadPrizesLoading = false;
      draft.loadPrizesError = action.error;
      break;

    case MODIFY_PRIZE_REQUEST:
      draft.modifyPrizeLoading = true;
      draft.modifyPrizeDone = false;
      draft.modifyPrizeError = null;
      break;
    case MODIFY_PRIZE_SUCCESS:
      draft.modifyPrizeLoading = false;
      draft.modifyPrizeDone = true;
      draft.prizes = draft.prizes.map(p =>
        p.id === action.data.id ? action.data : p
      );
      break;
    case MODIFY_PRIZE_FAILURE:
      draft.modifyPrizeLoading = false;
      draft.modifyPrizeError = action.error;
      break;

    case REMOVE_PRIZE_REQUEST:
      draft.removePrizeLoading = true;
      draft.removePrizeDone = false;
      draft.removePrizeError = null;
      break;
    case REMOVE_PRIZE_SUCCESS:
      draft.removePrizeLoading = false;
      draft.removePrizeDone = true;
      draft.prizes = draft.prizes.filter(p => p.id !== action.data);
      break;
    case REMOVE_PRIZE_FAILURE:
      draft.removePrizeLoading = false;
      draft.removePrizeError = action.error;
      break;

    case OPEN_RANDOM_BOX_REQUEST:
      draft.openRandomBoxLoading = true;
      draft.openRandomBoxDone = false;
      draft.openRandomBoxError = null;
      break;
    case OPEN_RANDOM_BOX_SUCCESS:
      draft.openRandomBoxLoading = false;
      draft.openRandomBoxDone = true;
      draft.issuedRandomBoxes = draft.issuedRandomBoxes.filter(box => box.issuedId !== action.data.issuedId);
      draft.latestCoupon = action.data.coupon || null;
      break;
    case OPEN_RANDOM_BOX_FAILURE:
      draft.openRandomBoxLoading = false;
      draft.openRandomBoxError = action.error;
      break;

    case LOAD_RANDOM_BOX_LIST_REQUEST:
      draft.loadRandomBoxListLoading = true;
      draft.loadRandomBoxListDone = false;
      draft.loadRandomBoxListError = null;
      break;
    case LOAD_RANDOM_BOX_LIST_SUCCESS:
      draft.loadRandomBoxListLoading = false;
      draft.loadRandomBoxListDone = true;
      draft.randomBoxes = action.data; // prizes 대신 randomBoxes에 저장
      break;
    case LOAD_RANDOM_BOX_LIST_FAILURE:
      draft.loadRandomBoxListLoading = false;
      draft.loadRandomBoxListError = action.error;
      break;

    case LOAD_ISSUED_RANDOM_BOXES_REQUEST:
      draft.loadIssuedRandomBoxesLoading = true;
      draft.loadIssuedRandomBoxesDone = false;
      draft.loadIssuedRandomBoxesError = null;
      break;
    case LOAD_ISSUED_RANDOM_BOXES_SUCCESS:
      draft.loadIssuedRandomBoxesLoading = false;
      draft.loadIssuedRandomBoxesDone = true;
      draft.issuedRandomBoxes = action.data;
      break;
    case LOAD_ISSUED_RANDOM_BOXES_FAILURE:
      draft.loadIssuedRandomBoxesLoading = false;
      draft.loadIssuedRandomBoxesError = action.error;
      break;  
  

    default:
      break;
  }
});

export default reducer;


// 액션 생성 함수 (예시)
export const addPrize = (data) => ({
  type: ADD_PRIZE_REQUEST,
  data,
});

export const loadPrizes = () => ({
  type: LOAD_PRIZES_REQUEST,
});

export const modifyPrize = (data) => ({
  type: MODIFY_PRIZE_REQUEST,
  data,
});

export const removePrize = (id) => ({
  type: REMOVE_PRIZE_REQUEST,
  data: id,
});

export const openRandomBox = (issuedId) => ({
  type: OPEN_RANDOM_BOX_REQUEST,
  data: issuedId,
});

export const loadRandomBoxList = () => ({
  type: LOAD_RANDOM_BOX_LIST_REQUEST,
});

export const loadIssuedRandomBoxes = () => ({
  type: LOAD_ISSUED_RANDOM_BOXES_REQUEST,
});

