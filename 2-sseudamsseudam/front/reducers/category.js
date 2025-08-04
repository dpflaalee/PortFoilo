import produce from 'immer';

// 액션 타입 정의
export const LOAD_CATEGORIES_REQUEST = 'LOAD_CATEGORIES_REQUEST';
export const LOAD_CATEGORIES_SUCCESS = 'LOAD_CATEGORIES_SUCCESS';
export const LOAD_CATEGORIES_FAILURE = 'LOAD_CATEGORIES_FAILURE';

export const ADD_CATEGORY_REQUEST = 'ADD_CATEGORY_REQUEST';
export const ADD_CATEGORY_SUCCESS = 'ADD_CATEGORY_SUCCESS';
export const ADD_CATEGORY_FAILURE = 'ADD_CATEGORY_FAILURE';

export const EDIT_CATEGORY_REQUEST = 'EDIT_CATEGORY_REQUEST';
export const EDIT_CATEGORY_SUCCESS = 'EDIT_CATEGORY_SUCCESS';
export const EDIT_CATEGORY_FAILURE = 'EDIT_CATEGORY_FAILURE';

// 초기 상태
const initialState = {
    categories: [], // 카테고리 목록
    loadCategoriesLoading: false,
    loadCategoriesDone: false,
    loadCategoriesError: null,

    addCategoryLoading: false,
    addCategoryDone: false,
    addCategoryError: null,

    editCategoryLoading: false,
    editCategoryDone: false,
    editCategoryError: null,
};

// 리듀서
const reducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            // 카테고리 목록 로드 요청
            case LOAD_CATEGORIES_REQUEST:
                draft.loadCategoriesLoading = true;
                draft.loadCategoriesDone = false;
                draft.loadCategoriesError = null;
                break;

            // 카테고리 목록 로드 성공
            case LOAD_CATEGORIES_SUCCESS:
                draft.categories = action.data;
                draft.loadCategoriesLoading = false;
                draft.loadCategoriesDone = true;
                break;

            // 카테고리 목록 로드 실패
            case LOAD_CATEGORIES_FAILURE:
                draft.loadCategoriesLoading = false;
                draft.loadCategoriesError = action.error;
                break;

            // 카테고리 추가 요청
            case ADD_CATEGORY_REQUEST:
                draft.addCategoryLoading = true;
                draft.addCategoryDone = false;
                draft.addCategoryError = null;
                break;

            // 카테고리 추가 성공
            case ADD_CATEGORY_SUCCESS:
                draft.categories.push(action.data); // 새 카테고리를 목록에 추가
                draft.addCategoryLoading = false;
                draft.addCategoryDone = true;
                break;

            // 카테고리 추가 실패
            case ADD_CATEGORY_FAILURE:
                draft.addCategoryLoading = false;
                draft.addCategoryError = action.error;
                break;

            // 카테고리 수정 요청
            case EDIT_CATEGORY_REQUEST:
                draft.editCategoryLoading = true;
                draft.editCategoryDone = false;
                draft.editCategoryError = null;
                break;

            // 카테고리 수정 성공
            case EDIT_CATEGORY_SUCCESS:
                draft.categories = draft.categories.map(cat =>
                    cat.id === action.data.id ? { ...cat, content: action.data.content, isAnimal: action.data.isAnimal } : cat
                );

                draft.editCategoryLoading = false;
                draft.editCategoryDone = true;
                break;

            // 카테고리 수정 실패
            case EDIT_CATEGORY_FAILURE:
                draft.editCategoryLoading = false;
                draft.editCategoryError = action.error;
                break;

            default:
                break;
        }
    });

export default reducer;