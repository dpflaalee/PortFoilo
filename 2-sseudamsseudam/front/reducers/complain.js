import shortId from 'shortid';  //##
import produce from 'immer';
import { faker } from '@faker-js/faker';
faker.seed(123);

///////////////////////////////////////////////////////////////////////
export const LOAD_COMPLAIN_REQUEST = 'LOAD_COMPLAIN_REQUEST';
export const LOAD_COMPLAIN_SUCCESS = 'LOAD_COMPLAIN_SUCCESS';
export const LOAD_COMPLAIN_FAILURE = 'LOAD_COMPLAIN_FAILURE';

export const ADD_COMPLAIN_REQUEST = 'ADD_COMPLAIN_REQUEST';
export const ADD_COMPLAIN_SUCCESS = 'ADD_COMPLAIN_SUCCESS';
export const ADD_COMPLAIN_FAILURE = 'ADD_COMPLAIN_FAILURE';

export const REMOVE_COMPLAIN_REQUEST = 'REMOVE_COMPLAIN_REQUEST';
export const REMOVE_COMPLAIN_SUCCESS = 'REMOVE_COMPLAIN_SUCCESS';
export const REMOVE_COMPLAIN_FAILURE = 'REMOVE_COMPLAIN_FAILURE';

export const IS_BLIND_REQUEST = 'IS_BLIND_REQUEST';
export const IS_BLIND_SUCCESS = 'IS_BLIND_SUCCESS';
export const IS_BLIND_FAILURE = 'IS_BLIND_FAILURE';
///////////////////////////////////////////////////////////////////////

export const initialState = {
    loadComplainLoading: false,
    loadComplainDone: false,
    loadComplainError: null,

    addComplainLoading: false,
    addComplainDone: false,
    addComplainError: null,

    removeComplainLoading: false,
    removeComplainDone: false,
    removeComplainError: null,

    isBlindLoading: false,
    isBlindDone: false,
    isBlindError: null,

    mainComplainCard: [],
};

//////////////////////////////////////////

const reducer = (state = initialState, action) => produce(state, (draft) => {
    switch (action.type) {
        //////////////////////////////
        case LOAD_COMPLAIN_REQUEST:
            draft.loadComplainLoading = true;
            draft.loadComplainDone = false;
            draft.loadComplainError = null;
            break;

        case LOAD_COMPLAIN_SUCCESS:
            draft.loadComplainLoading = false;
            draft.loadComplainDone = true;
            draft.loadComplainError = null;
            draft.mainComplainCard = action.data;
            break;

        case ADD_COMPLAIN_FAILURE:
            draft.loadComplainLoading = false;
            draft.loadComplainDone = true;
            draft.loadComplainError = action.error;
            break;

        ///////////////////////////////////////
        case ADD_COMPLAIN_REQUEST:
            draft.addComplainLoading = true;
            draft.addComplainDone = false;
            draft.addComplainError = null;
            break;

        case ADD_COMPLAIN_SUCCESS:
            const newComplain = action.data;
            draft.addComplainLoading = false;
            draft.addComplainDone = true;
            draft.addComplainError = null;
            draft.mainComplainCard = [newComplain, ...draft.mainComplainCard];
            break;

        case ADD_COMPLAIN_FAILURE:
            draft.addComplainLoading = false;
            draft.addComplainDone = false;
            draft.addComplainError = action.error;
            console.log('🐢 ADD_COMPLAIN_FAILURE : ', action.error);
            break;

        ////////////////////////////////////////
        case REMOVE_COMPLAIN_REQUEST:
            draft.removeComplainLoading = true;
            draft.loadComplainDone = false;
            draft.removeComplainDone = null;
            break;

        case REMOVE_COMPLAIN_SUCCESS:
            draft.removeComplainLoading = false;
            draft.loadComplainDone = true;
            draft.removeComplainDone = null;
            break;

        case REMOVE_COMPLAIN_FAILURE:
            draft.removeComplainLoading = false;
            draft.loadComplainDone = false;
            draft.removeComplainDone = action.error;
            break;

        ////////////////////////////////////////
        case IS_BLIND_REQUEST:
            draft.isBlindLoading = true;
            draft.isBlindDone = false;
            draft.isBlindError = null;
            break;
        case IS_BLIND_SUCCESS:
            draft.isBlindLoading = false;
            draft.isBlindDone = true;
            draft.isBlindError = null;
            draft.mainComplainCard = draft.mainComplainCard.map((report) =>
                report.targetId === action.data.targetId
                    ? { ...report, isBlind: true }
                    : report
            );
            break;

        case IS_BLIND_FAILURE:
            draft.isBlindLoading = false;
            draft.isBlindDone = false;
            draft.isBlindError = action.error;
            console.log('🚨IS_BLIND_FAILURE : ', action.error);
            break;
        ////////////////////////////////////////
        default:
            break;
    }
});

export default reducer;
