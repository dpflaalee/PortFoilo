//import produce from '../util/produce.js';
import produce from 'immer';

////////////////////////////////////////////////////// 초기값

export const initialState = {
  followerList: [],
  hasMoreList: true,
  userImagePaths: [],

  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,
  logOutLoading: false, // 로그아웃 시도중
  logOutDone: false,
  logOutError: null,
  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,
  changeNicknameLoading: false, // 닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,
  userOutLoading: false,//회원 탈퇴 시도중
  userOutDone: false,
  userOutError: null,

  userProfileLoading: false, //회원 프로필 수정 시도중
  userProfileDone: false,
  userProfileError: null,
  
  userImageLoading: false, //회원 이미지 수정 시도중
  userImageDone: false,
  userImageError: null,

  userPasswordChangeLoading:false,
  userPasswordChangeDone:false,
  userPasswordChangeError:null,

  followLoading: false, // 팔로우 시도중
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,

  loadFollowingsLoading: false,
  loadFollowingsDone: false,
  loadFollowingsError: null,
  loadFollowersLoading: false,
  loadFollowersDone: false,
  loadFollowersError: null,
  removeFollowerLoading: false,
  removeFollowerDone: false,
  removeFollowerError: null,

  loadMyInfoLoading: false, // 유저 정보 가져오기 시도중
  loadMyInfoDone: false,
  loadMyInfoError: null,
  loadUserLoading: false, // 유저 정보 가져오기 시도중
  loadUserDone: false,
  loadUserError: null,

  user: null,
  userInfo: null,
  signUpData: {},
  loginData: {},

  //// 차단
  blockList: [],
  loadBlockLoading: false,
  loadBlockDone: false,
  loadBlockError: null,

  addBlockLoading: false,
  addBlockDone: false,
  addBlockError: null,

  removeBlockLoading: false,
  removeBlockDone: false,
  removeBlockError: null
};
/*
const dummyUser = (data) => ({
  ...data,
  nickname: 'sally',
  id: 1,
  Posts: [{ id: 1 }], 
  Followings : [{nickname:'apple'} , {nickname:'banana'} , {nickname:'coconut'} , ],
  Followers  : [{nickname:'one'} , {nickname:'two'} , {nickname:'three'} ,]
});
*/
////////////////////////////////////////////////////// action
/*
export const loginRequestAction = (data) => ({
  type: LOG_IN_REQUEST,
  data,
});

export const logoutRequestAction = () => ({
  type: LOG_OUT_REQUEST,
});

const dummyUser = (data) => ({
  ...data,
  nickname: 'sally',
  id: 1,
  Posts: [{ id: 1 }], 
  Followings : [{nickname:'apple'} , {nickname:'banana'} , {nickname:'coconut'} , ],
  Followers  : [{nickname:'one'} , {nickname:'two'} , {nickname:'three'} ,]
});
*/

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const USER_DELETE_REQUEST = 'USER_DELETE_REQUEST';
export const USER_DELETE_SUCCESS = 'USER_DELETE_SUCCESS';
export const USER_DELETE_FAILURE = 'USER_DELETE_FAILURE';

export const USER_PROFILE_UPDATE_REQUEST = 'USER_PROFILE_UPDATE_REQUEST';
export const USER_PROFILE_UPDATE_SUCCESS = 'USER_PROFILE_UPDATE_SUCCESS';
export const USER_PROFILE_UPDATE_FAILURE = 'USER_PROFILE_UPDATE_FAILURE';

export const USER_IMAGE_UPDATE_REQUEST = 'USER_IMAGE_UPDATE_REQUEST';
export const USER_IMAGE_UPDATE_SUCCESS = 'USER_IMAGE_UPDATE_SUCCESS';
export const USER_IMAGE_UPDATE_FAILURE = 'USER_IMAGE_UPDATE_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';


export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';


export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

export const LOAD_BLOCK_REQUEST = 'LOAD_BLOCK_REQUEST';
export const LOAD_BLOCK_SUCCESS = 'LOAD_BLOCK_SUCCESS';
export const LOAD_BLOCK_FAILURE = 'LOAD_BLOCK_FAILURE';

export const ADD_BLOCK_REQUEST = 'ADD_BLOCK_REQUEST';
export const ADD_BLOCK_SUCCESS = 'ADD_BLOCK_SUCCESS';
export const ADD_BLOCK_FAILURE = 'ADD_BLOCK_FAILURE';

export const REMOVE_BLOCK_REQUEST = 'REMOVE_BLOCK_REQUEST';
export const REMOVE_BLOCK_SUCCESS = 'REMOVE_BLOCK_SUCCESS';
export const REMOVE_BLOCK_FAILURE = 'REMOVE_BLOCK_FAILURE';

export const USER_PASSWORD_CHANGE_REQUEST = 'USER_PASSWORD_CHANGE_REQUEST';
export const USER_PASSWORD_CHANGE_SUCCESS = 'USER_PASSWORD_CHANGE_SUCCESS';
export const USER_PASSWORD_CHANGE_FAILURE = 'USER_PASSWORD_CHANGE_FAILURE';

////////////////////////////////////////////////////// next
const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case LOG_IN_REQUEST:
      console.log('내 정보 요청:', action.data);  // 이 부분에서 요청하는 데이터 확인
      draft.logInLoading = true;
      draft.logInError = null;
      draft.logInDone = false;
      break;
    case LOG_IN_SUCCESS:
      console.log('로그인 성공 데이터:', action.data); // 추가된 로그로 data 확인
      draft.logInLoading = false;
      draft.user = action.data;   ////dummyUser(action.data);
      draft.logInDone = true;
      break;
    case LOG_IN_FAILURE:
      draft.logInLoading = false;
      draft.logInError = action.error;
      break;
    case LOG_OUT_REQUEST:
      draft.logOutLoading = true;
      draft.logOutError = null;
      draft.logOutDone = false;
      break;
    case LOG_OUT_SUCCESS:
      draft.logOutLoading = false;
      draft.logOutDone = true;
      draft.user = null;
      break;
    case LOG_OUT_FAILURE:
      draft.logOutLoading = false;
      draft.logOutError = action.error;
      break;
    case SIGN_UP_REQUEST:
      draft.signUpLoading = true;
      draft.signUpError = null;
      draft.signUpDone = false;
      break;
    case SIGN_UP_SUCCESS:
      draft.signUpLoading = false;
      draft.signUpDone = true;
      break;
    case SIGN_UP_FAILURE:
      draft.signUpLoading = false;
      draft.signUpError = action.error;
      break;
    case USER_DELETE_REQUEST:
      draft.userOutLoading = true;
      draft.userOutError = null;
      draft.userOutDone = false;
      break;
    case USER_DELETE_SUCCESS:
      draft.userOutLoading = false;
      draft.userOutDone = true;
      break;
    case USER_DELETE_FAILURE:
      draft.userOutLoading = false;
      draft.userOutError = action.error;
      break;
    case USER_PROFILE_UPDATE_REQUEST:
      console.log('USER_PROFILE_UPDATE_REQUEST', action.data);
      for (let pair of action.data.entries()) {
        console.log('📦 saga에서 FormData 확인:', pair[0], pair[1]);
      }
      draft.userProfileLoading= true; //회원 프로필 수정 시도중
      draft.userProfileDone= false;
      draft.userProfileError= null;
      //draft.userImagePaths= action.data;
      break;
    case USER_PROFILE_UPDATE_SUCCESS:
      console.log('USER_PROFILE_UPDATE_SUCCESS=',action.data);
      draft.userImagePaths = draft.userImagePaths.concat(action.data);
      //draft.userImagePaths = action.data;
      draft.userProfileLoading= false;
      draft.userProfileDone= false;
      break;
    case USER_PROFILE_UPDATE_FAILURE:
      draft.userProfileLoading = false;
      draft.userProfileError = action.error;
      break;

    case USER_IMAGE_UPDATE_REQUEST:
      console.log('USER_IMAGE_UPDATE_REQUEST',action.data);
      draft.userImageLoading= true; //회원 이미지 수정 시도중
      draft.userImageDone= false;
      draft.userImageError= null;
      break;
    case USER_IMAGE_UPDATE_SUCCESS:
      console.log('USER_IMAGE_UPDATE_SUCCESS',action.data);
      draft.userImagePaths = draft.userImagePaths.concat(action.data);
      //draft.userImagePaths = action.data;
      draft.userImageLoading= false;
      draft.userImageDone= false;
      break;
    case USER_IMAGE_UPDATE_FAILURE:
      draft.userImageLoading= false;
      draft.userImageError= action.error;
      break;

    case CHANGE_NICKNAME_REQUEST:
      draft.changeNicknameLoading = true;
      draft.changeNicknameError = null;
      draft.changeNicknameDone = false;
      break;
    case CHANGE_NICKNAME_SUCCESS:
      draft.user.nickname = action.data.nickname;
      draft.changeNicknameLoading = false;
      draft.changeNicknameDone = true;
      break;
    case CHANGE_NICKNAME_FAILURE:
      draft.changeNicknameLoading = false;
      draft.changeNicknameError = action.error;
      break;
    case USER_PASSWORD_CHANGE_REQUEST:
      draft.userPasswordChangeLoading=false;
      draft.userPasswordChangeDone=false;
      draft.userPasswordChangeError=null;
      break;
    case USER_PASSWORD_CHANGE_SUCCESS:
      draft.userPasswordChangeLoading=false;
      draft.userPasswordChangeDone=true;
      break;
    case USER_PASSWORD_CHANGE_FAILURE:
      draft.userPasswordChangeLoading=false;
      draft.userPasswordChangeError=action.error;
      break;
    //////////////////////////////
    case FOLLOW_REQUEST:
      draft.followLoading = true;
      draft.followError = null;
      draft.followDone = false;
      break;
    case FOLLOW_SUCCESS:
      //console.log('FOLLOW_SUCCESS',action.data.UserId);
      draft.followLoading = false;
      draft.user.Followings.push({ id: action.data.UserId });
      draft.followDone = true;
      break;
    case FOLLOW_FAILURE:
      draft.followLoading = false;
      draft.followError = action.error;
      break;
    case UNFOLLOW_REQUEST:
      draft.unfollowLoading = true;
      draft.unfollowError = null;
      draft.unfollowDone = false;
      break;
    case UNFOLLOW_SUCCESS:
      draft.unfollowLoading = false;
      draft.user.Followings = draft.user.Followings.filter((v) => v.id !== action.data.UserId);
      draft.unfollowDone = true;
      break;
    case UNFOLLOW_FAILURE:
      draft.unfollowLoading = false;
      draft.unfollowError = action.error;
      break;
    //////////////////////////////
    case REMOVE_FOLLOWER_REQUEST:
      draft.removeFollowerLoading = true;
      draft.removeFollowerError = null;
      draft.removeFollowerDone = false;
      break;
    case REMOVE_FOLLOWER_SUCCESS:
      draft.removeFollowerLoading = false;
      draft.user.Followers = draft.user.Followers.filter((v) => v.id !== action.data.UserId);
      draft.removeFollowerDone = true;
      break;
    case REMOVE_FOLLOWER_FAILURE:
      draft.removeFollowerLoading = false;
      draft.removeFollowerError = action.error;
      break;
    case LOAD_FOLLOWINGS_REQUEST:
      draft.loadFollowingsLoading = true;
      draft.loadFollowingsError = null;
      draft.loadFollowingsDone = false;
      break;
    case LOAD_FOLLOWINGS_SUCCESS:
      draft.loadFollowingsLoading = false;
      draft.user.Followings = action.data;
      draft.loadFollowingsDone = true;
      break;
    case LOAD_FOLLOWINGS_FAILURE:
      draft.loadFollowingsLoading = false;
      draft.loadFollowingsError = action.error;
      break;
    case LOAD_FOLLOWERS_REQUEST:
      draft.loadFollowersLoading = true;
      draft.loadFollowersError = null;
      draft.loadFollowersDone = false;
      break;
    case LOAD_FOLLOWERS_SUCCESS:
      draft.loadFollowersLoading = false;
      draft.user.Followers = action.data;
      draft.loadFollowersDone = true;
      //draft.followerList = draft.followerList.concat(draft.followerList);
      draft.followerList = action.data.concat(draft.followerList);
      draft.hasMoreList = draft.followerList.length < 10;
      break;
    case LOAD_FOLLOWERS_FAILURE:
      draft.loadFollowersLoading = false;
      draft.loadFollowersError = action.error;
      break;

    //////////////////////////////
    case LOAD_MY_INFO_REQUEST:
      draft.loadMyInfoLoading = true;
      draft.loadMyInfoError = null;
      draft.loadMyInfoDone = false;
      break;
    case LOAD_MY_INFO_SUCCESS:
      console.log('내 정보 로드 성공:', action.data); // 추가된 로그로 data 확인
      draft.loadMyInfoLoading = false;
      draft.user = action.data;
      draft.loadMyInfoDone = true;
      break;
    case LOAD_MY_INFO_FAILURE:
      draft.loadMyInfoLoading = false;
      draft.loadMyInfoError = action.error;
      break;
    case LOAD_USER_REQUEST:
      draft.loadUserLoading = true;
      draft.loadUserError = null;
      draft.loadUserDone = false;
      break;
    case LOAD_USER_SUCCESS:
      draft.loadUserLoading = false;
      draft.userInfo = action.data;
      draft.loadUserDone = true;
      break;
    case LOAD_USER_FAILURE:
      draft.loadUserLoading = false;
      draft.loadUserError = action.error;
      break;

    //////////////////////////////
    case ADD_POST_TO_ME:
      draft.user.Posts.unshift({ id: action.data });
      break;
    case REMOVE_POST_OF_ME:
      draft.user.Posts = draft.user.Posts.filter((v) => v.id !== action.data);
      break;

    /////////////////////////// 차단
    case LOAD_BLOCK_REQUEST:
      draft.loadBlockLoading = true;
      draft.loadBlockDone = false;
      draft.loadBlockError = null;
      break;
    case LOAD_BLOCK_SUCCESS:
      draft.loadBlockLoading = false;
      draft.loadBlockDone = true;
      draft.loadBlockError = null;
      draft.blockList = action.data;
      break;
    case LOAD_BLOCK_FAILURE:
      draft.loadBlockLoading = false;
      draft.loadBlockDone = false;
      draft.loadBlockError = action.error;
      break;
    /////////////////////
    case ADD_BLOCK_REQUEST:
      console.log('💥', action.data);
      draft.addBlockLoading = true;
      draft.addBlockDone = false;
      draft.addBlockError = null;
      break;
    case ADD_BLOCK_SUCCESS:
      draft.addBlockLoading = false;
      draft.addBlockDone = true;
      draft.addBlockError = null;
      draft.blockList.push(action.data);
      break;
    case ADD_BLOCK_FAILURE:
      draft.addBlockLoading = false;
      draft.addBlockDone = false;
      draft.addBlockError = action.error;
      break;

    case REMOVE_BLOCK_REQUEST:
      draft.removeBlockLoading = true;
      draft.removeBlockDone = false;
      draft.addBlockError = null;
      break;
    case REMOVE_BLOCK_SUCCESS:
      draft.removeBlockLoading = false;
      draft.removeBlockDone = true;
      draft.addBlockError = null;
      draft.blockList = draft.blockList.filter((v) => v.id !== action.data);
      break;
    case REMOVE_BLOCK_FAILURE:
      draft.removeBlockLoading = false;
      draft.removeBlockDone = false;
      draft.addBlockError = action.error;
      break
    ///////////////////////////
    default:
      break;
  }
});

export default reducer;
