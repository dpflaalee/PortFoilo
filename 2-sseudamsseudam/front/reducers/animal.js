import {produce} from 'immer';

export const initialState = {
  animals: [],  // 동물 프로필 리스트
  selectedAnimal: null, // 현재 선택된 동물 상세 프로필

  userAnimals: [],     // 선택한 동물의 유저가 가진 모든 동물 목록
  myAnimals: [],       // 내 동물들 (내가 등록한 전체 리스트)
  userDetailAnimals: [],

  followers: [],
  followings: [],

  recommendedAnimals: [],

  searchResults: [],

  addaniprofileLoading: false,  //동물프로필 추가 시도중
  addaniprofileDone: false,
  addAniprofileError: null,

  removeAniprofileLoading: false, //프로필 제거 시도중
  removeAniprofileDone: false,
  removeAniprofileError: null,

  loadAnimalProfileLoading: false, //프로필 불러오기 시도중
  loadAnimalProfileDone: false,
  loadAnimalProfileError: null,

  loadAnimalListLoading: false, //
  loadAnimalListDone: false,
  loadAnimalListError: null,

  modifyAniprofileLoading: false, //프로필 수정 시도중
  modifyAniprofileDone: false,
  modifyAniprofileError: null,
  
  anifollowLoading: false,  //팔로우 시도중
  anifollowDone: false,
  anifollowError: null,
  
  aniunfollowLoading: false,  //언팔로우 시도중
  aniunfollowDone: false,
  aniunfollowError: null,

  removeAnifollowLoading: false, //팔로워/팔로잉 제거 시도중
  removeAnifollowDone: false,
  removeAnifollowError: null,

  loadAnifollowersLoading: false,  //팔로워 불러오기 시도중
  loadAnifollowersDone: false,
  loadAnifollowersError: null,

  loadAnifollowingsLoading: false,  //팔로잉 불러오기 시도중
  loadAnifollowingsDone: false,
  loadAnifollowingsError: null,

  loadRecommendedAnimalsLoading: false, //추천친구 불러오기
  loadRecommendedAnimalsDone: false,
  loadRecommendedAnimalsError: null,

  searchProfilesLoading: false,
  searchProfilesDone: false,
  searchProfilesError: null,

  loadUserAnimalListLoading: false,
  loadUserAnimalListDone: false,
  loadUserAnimalListError: null,
  animal: null,
}

export const ADD_ANIPROFILE_REQUEST = 'ADD_ANIPROFILE_REQUEST';
export const ADD_ANIPROFILE_SUCCESS = 'ADD_ANIPROFILE_SUCCESS';
export const ADD_ANIPROFILE_FAILURE = 'ADD_ANIPROFILE_FAILURE';

export const LOAD_ANIMAL_PROFILE_REQUEST = 'LOAD_ANIMAL_PROFILE_REQUEST';
export const LOAD_ANIMAL_PROFILE_SUCCESS = 'LOAD_ANIMAL_PROFILE_SUCCESS';
export const LOAD_ANIMAL_PROFILE_FAILURE = 'LOAD_ANIMAL_PROFILE_FAILURE';

export const LOAD_ANIMAL_LIST_REQUEST = 'LOAD_ANIMAL_LIST_REQUEST';
export const LOAD_ANIMAL_LIST_SUCCESS = 'LOAD_ANIMAL_LIST_SUCCESS';
export const LOAD_ANIMAL_LIST_FAILURE = 'LOAD_ANIMAL_LIST_FAILURE';

export const REMOVE_ANIPROFILE_REQUEST = 'REMOVE_ANIPROFILE_REQUEST';
export const REMOVE_ANIPROFILE_SUCCESS = 'REMOVE_ANIPROFILE_SUCCESS';
export const REMOVE_ANIPROFILE_FAILURE = 'REMOVE_ANIPROFILE_FAILURE';

export const ANIFOLLOW_REQUEST = 'ANIFOLLOW_REQUEST';
export const ANIFOLLOW_SUCCESS = 'ANIFOLLOW_SUCCESS';
export const ANIFOLLOW_FAILURE = 'ANIFOLLOW_FAILURE';

export const ANIUNFOLLOW_REQUEST = 'ANIUNFOLLOW_REQUEST';
export const ANIUNFOLLOW_SUCCESS = 'ANIUNFOLLOW_SUCCESS';
export const ANIUNFOLLOW_FAILURE = 'ANIUNFOLLOW_FAILURE';

export const RESET_ANIFOLLOW_STATE = 'RESET_ANIFOLLOW_STATE';

export const MODIFY_ANIPROFILE_REQUEST = 'MODIFY_ANIPROFILE_REQUEST';
export const MODIFY_ANIPROFILE_SUCCESS = 'MODIFY_ANIPROFILE_SUCCESS';
export const MODIFY_ANIPROFILE_FAILURE = 'MODIFY_ANIPROFILE_FAILURE';
export const RESET_MODIFY_ANIPROFILE_STATE = 'RESET_MODIFY_ANIPROFILE_STATE';


export const REMOVE_ANIFOLLOW_REQUEST = 'REMOVE_ANIFOLLOW_REQUEST';
export const REMOVE_ANIFOLLOW_SUCCESS = 'REMOVE_ANIFOLLOW_SUCCESS';
export const REMOVE_ANIFOLLOW_FAILURE = 'REMOVE_ANIFOLLOW_FAILURE';

export const LOAD_ANIFOLLOWERS_REQUEST = 'LOAD_ANIFOLLOWERS_REQUEST';
export const LOAD_ANIFOLLOWERS_SUCCESS = 'LOAD_ANIFOLLOWERS_SUCCESS';
export const LOAD_ANIFOLLOWERS_FAILURE = 'LOAD_ANIFOLLOWERS_FAILURE';

export const LOAD_ANIFOLLOWINGS_REQUEST = 'LOAD_ANIFOLLOWINGS_REQUEST';
export const LOAD_ANIFOLLOWINGS_SUCCESS = 'LOAD_ANIFOLLOWINGS_SUCCESS';
export const LOAD_ANIFOLLOWINGS_FAILURE = 'LOAD_ANIFOLLOWINGS_FAILURE';

export const LOAD_RECOMMENDED_ANIMALS_REQUEST = 'LOAD_RECOMMENDED_ANIMALS_REQUEST';
export const LOAD_RECOMMENDED_ANIMALS_SUCCESS = 'LOAD_RECOMMENDED_ANIMALS_SUCCESS';
export const LOAD_RECOMMENDED_ANIMALS_FAILURE = 'LOAD_RECOMMENDED_ANIMALS_FAILURE';

export const SEARCH_PROFILES_REQUEST = 'SEARCH_PROFILES_REQUEST';
export const SEARCH_PROFILES_SUCCESS = 'SEARCH_PROFILES_SUCCESS';
export const SEARCH_PROFILES_FAILURE = 'SEARCH_PROFILES_FAILURE';

export const LOAD_USER_ANIMAL_LIST_REQUEST = 'LOAD_USER_ANIMAL_LIST_REQUEST';
export const LOAD_USER_ANIMAL_LIST_SUCCESS = 'LOAD_USER_ANIMAL_LIST_SUCCESS';
export const LOAD_USER_ANIMAL_LIST_FAILURE = 'LOAD_USER_ANIMAL_LIST_FAILURE';

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch(action.type){
    case LOAD_USER_ANIMAL_LIST_REQUEST:
      draft.loadUserAnimalListLoading = true;
      draft.loadUserAnimalListDone = false; 
      draft.loadUserAnimalListError = null;
      break;
    case LOAD_USER_ANIMAL_LIST_SUCCESS:
      draft.userDetailAnimals = action.data;
      draft.loadUserAnimalListDone = true;
      break;
    case LOAD_USER_ANIMAL_LIST_FAILURE:
      draft.loadUserAnimalListError = action.error;
      break;
    case SEARCH_PROFILES_REQUEST:
      draft.searchProfilesLoading = true;
      draft.searchProfilesDone = false;
      draft.searchProfilesError = null;
      break;
    case SEARCH_PROFILES_SUCCESS:
      draft.addaniprofileLoading = false;
      draft.addaniprofileDone = true;
      draft.searchResults = action.data;
      break;
    case SEARCH_PROFILES_FAILURE:
      draft.addaniprofileLoading = false;
      draft.addAniprofileError = action.error;
      break;
    case ADD_ANIPROFILE_REQUEST:
      draft.addaniprofileLoading = true;
      draft.addaniprofileDone = false;
      draft.addAniprofileError = null;
      break;
    case ADD_ANIPROFILE_SUCCESS:
      draft.addaniprofileLoading = false;
      draft.addaniprofileDone = true;
      draft.animals.push(action.data);  // 프론트 메모리(redux)에 저장됨
      break;
    case ADD_ANIPROFILE_FAILURE:
      draft.addaniprofileLoading = false;
      draft.addAniprofileError = action.error;
      break;
    case LOAD_ANIMAL_LIST_REQUEST:
      draft.loadAnimalListLoading = true;
      draft.loadAnimalListError = null;
      break;
    case LOAD_ANIMAL_LIST_SUCCESS:
      draft.loadAnimalListLoading = false;
      draft.loadAnimalListDone = true;
      draft.myAnimals = action.data;
      draft.animals = action.data;
      break;
    case LOAD_ANIMAL_LIST_FAILURE:
      draft.loadAnimalListLoading = false;
      draft.loadAnimalListError = action.error;
      break;
    case LOAD_ANIMAL_PROFILE_REQUEST:
      draft.loadAnimalProfileLoading = true;
      draft.loadAnimalProfileDone = false;
      draft.loadAnimalProfileError = null;
      break;
    case LOAD_ANIMAL_PROFILE_SUCCESS:
      draft.loadAnimalProfileLoading = false;
      draft.loadAnimalProfileDone = true;
      draft.selectedAnimal = action.data.animal;
      draft.userAnimals = action.data.userAnimals;
      break;
    case LOAD_ANIMAL_PROFILE_FAILURE:
      draft.loadAnimalProfileLoading = false;
      draft.loadAnimalProfileError = action.error;
      break;
    case RESET_ANIFOLLOW_STATE:
      draft.anifollowDone = false;
      draft.aniunfollowDone = false;
      draft.anifollowError = null;
      draft.aniunfollowError = null;
      break;
    case ANIFOLLOW_REQUEST:
      draft.anifollowLoading = true;
      draft.anifollowDone = false;
      draft.anifollowError = null;
      break;
    case ANIFOLLOW_SUCCESS:
      draft.anifollowLoading = false;
      draft.anifollowDone = true;
      //추천 친구 리스트 업데이트
      draft.recommendedAnimals = draft.recommendedAnimals.map((a) =>
        a.id === action.data.followedId ? { ...a, isFollowing: true } : a
      );
      draft.followings = draft.followings.map((a) =>
        a.id === action.data.followedId ? { ...a, isFollowing: true } : a
      );
      draft.followers = draft.followers.map((a) =>
        a.id === action.data.followedId ? { ...a, isFollowing: true } : a
      );
      break;
    case ANIFOLLOW_FAILURE:
      draft.anifollowLoading = false;
      draft.anifollowError = action.error;
      break; 

    case ANIUNFOLLOW_REQUEST:
      draft.aniunfollowLoading = true;
      draft.aniunfollowDone = false;
      draft.aniunfollowError = null;
      break;
    case ANIUNFOLLOW_SUCCESS:
      draft.aniunfollowLoading = false;
      draft.aniunfollowDone = true;
      draft.recommendedAnimals = draft.recommendedAnimals.map((a) =>
        a.id === action.data.unfollowedId ? { ...a, isFollowing: false } : a
      );
      draft.followings = draft.followings.map((a) =>
        a.id === action.data.unfollowedId ? { ...a, isFollowing: false } : a
      );
      draft.followers = draft.followers.map((a) =>
        a.id === action.data.unfollowedId ? { ...a, isFollowing: false } : a
      );
      break;
    case ANIUNFOLLOW_FAILURE:
      draft.aniunfollowLoading = false;
      draft.aniunfollowError = action.error;
      break;

    case REMOVE_ANIPROFILE_REQUEST:
      draft.removeAniprofileLoading = true;
      draft.removeAniprofileDone = false;
      draft.removeAniprofileError = null;
      break;
    case REMOVE_ANIPROFILE_SUCCESS:
      draft.removeAniprofileLoading = false;
      draft.removeAniprofileDone = true;
      draft.animals = draft.animals.filter((v) => v.id !== action.data);
      break;
    case REMOVE_ANIPROFILE_FAILURE:
      draft.removeAniprofileLoading = false;
      draft.removeAniprofileError = action.error;
      break;
    case LOAD_ANIFOLLOWERS_SUCCESS:
      draft.loadAnifollowersLoading = false;
      draft.loadAnifollowersDone = true;
      const myFollowingIds = draft.followings.map(f => f.id);
      draft.followers = action.data.map((follower) => ({
        ...follower,
        isFollowing: myFollowingIds.includes(follower.id),
      }));
      break;
    case LOAD_ANIFOLLOWINGS_SUCCESS:
      draft.loadAnifollowingsLoading = false;
      draft.loadAnifollowingsDone = true;
      draft.followings = action.data.map((a) => ({
        ...a,
        isFollowing: true,
      }));
      break;
    case LOAD_RECOMMENDED_ANIMALS_REQUEST:
      draft.loadRecommendedAnimalsLoading = true;
      draft.loadRecommendedAnimalsDone = false;
      draft.loadRecommendedAnimalsError = null;
      break;
    case LOAD_RECOMMENDED_ANIMALS_SUCCESS:
      draft.loadRecommendedAnimalsLoading = false;
      draft.loadRecommendedAnimalsDone = true;
      draft.recommendedAnimals = action.data;
      break;
    case LOAD_RECOMMENDED_ANIMALS_FAILURE:
      draft.loadRecommendedAnimalsLoading = false;
      draft.loadRecommendedAnimalsError = action.error;
      break;

    case MODIFY_ANIPROFILE_REQUEST:
      draft.modifyAniprofileLoading = true;
      draft.modifyAniprofileDone = false;
      draft.modifyAniprofileError = null;
      break;
    case MODIFY_ANIPROFILE_SUCCESS:
      draft.modifyAniprofileLoading = false;
      draft.modifyAniprofileDone = true;
      // 수정된 동물을 redux에서 찾아 업데이트
      draft.animals = draft.animals.map((animal) =>
        animal.id === action.data.id ? { ...animal, ...action.data } : animal
      );
      draft.myAnimals = draft.myAnimals.map((animal) =>
        animal.id === action.data.id ? { ...animal, ...action.data } : animal
      );
      if (draft.selectedAnimal?.id === action.data.id) {
        draft.selectedAnimal = { ...draft.selectedAnimal, ...action.data };
      }
      break;
    case MODIFY_ANIPROFILE_FAILURE:
      draft.modifyAniprofileLoading = false;
      draft.modifyAniprofileError = action.error;
      break;
    case RESET_MODIFY_ANIPROFILE_STATE:
      draft.modifyAniprofileDone = false;
      draft.modifyAniprofileError = null;
      break;
    case REMOVE_ANIFOLLOW_REQUEST:
      draft.removeAnifollowLoading = true;
      draft.removeAnifollowDone = false;
      draft.removeAnifollowError = null;
      break;
    case REMOVE_ANIFOLLOW_SUCCESS:
      draft.removeAnifollowError = false;
      draft.followers = draft.followers.filter((v) => v.id !== action.data.removedFollowerId);
      draft.removeAnifollowDone = true;
      break;
    case REMOVE_ANIFOLLOW_FAILURE:
      draft.removeAnifollowLoading = false;
      draft.removeAnifollowError = action.error;
      break;
    default:
      break;
  }
})
export default reducer;

// action creator
export const addAniProfile = (data) => ({
  type: ADD_ANIPROFILE_REQUEST,
  data,
});

export const aniUnfollow = (id) => ({
  type: ANIUNFOLLOW_REQUEST,
  data: id,
});
export const anifollow = (id) => ({
  type: ANIFOLLOW_REQUEST,
  data: id,
});

export const removeAniProfile = (id) => ({
  type: REMOVE_ANIPROFILE_REQUEST,
  data: id,
});
export const loadAnimalProfile = (id) => ({ 
  type: LOAD_ANIMAL_PROFILE_REQUEST, data: id 
});
export const loadAnimalList = () => ({ 
  type: LOAD_ANIMAL_LIST_REQUEST 
});
export const removeAniFollow = (id) => ({
  type: REMOVE_ANIFOLLOW_REQUEST,
  data: id,
});