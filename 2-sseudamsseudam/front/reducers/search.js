import shortId from 'shortid';  //##
import produce from 'immer';
import { faker } from '@faker-js/faker';
faker.seed(123);

///////////////////////////////////////////////////////////////////////
export const SEARCH_REQUEST = 'SEARCH_REQUEST';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
///////////////////////////////////////////////////////////////////////

export const initialState = {
    searchLoading: false,
    searchDone: false,
    searchError: null,

    mainSearchResult: [],
};

//////////////////////////////////////////

const reducer = (state = initialState, action) => produce(state, (draft) => {
    console.log('🐬 search reducer');
    console.log('🐬 search reducer : data', action.data);
    switch (action.type) {
        //////////////////////////////
        case SEARCH_REQUEST:
            draft.searchLoading = true;
            draft.searchDone = false;
            draft.searchError = null;
            break;

        case SEARCH_SUCCESS:
            draft.searchLoading = false;
            draft.searchDone = true;
            draft.searchError = null;
            draft.mainSearchResult = action.data;
            break;

        case SEARCH_FAILURE:
            console.log('🐬 검색 결과 데이터', action.data);
            draft.searchLoading = false;
            draft.searchDone = true;
            draft.loadComplainError = action.error;
            break;

        ////////////////////////////////////////
        default:
            break;
    }
});

export default reducer;
