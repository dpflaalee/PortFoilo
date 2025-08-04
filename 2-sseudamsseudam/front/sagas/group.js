import { notification } from 'antd';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOAD_GROUPS_REQUEST, LOAD_GROUPS_SUCCESS, LOAD_GROUPS_FAILURE, // 그룹 로드
  CREATE_GROUP_REQUEST, CREATE_GROUP_SUCCESS, CREATE_GROUP_FAILURE, // 그룹 생성
  UPDATE_GROUP_REQUEST, UPDATE_GROUP_SUCCESS, UPDATE_GROUP_FAILURE, // 그룹 수정
  DELETE_GROUP_REQUEST, DELETE_GROUP_SUCCESS, DELETE_GROUP_FAILURE, // 그룹 삭제
  LOAD_SINGLE_GROUP_REQUEST, LOAD_SINGLE_GROUP_SUCCESS, LOAD_SINGLE_GROUP_FAILURE,
  LOAD_MEMBERS_REQUEST, LOAD_MEMBERS_SUCCESS, LOAD_MEMBERS_FAILURE, // 멤버 로드
  LEAVE_GROUP_REQUEST, LEAVE_GROUP_SUCCESS, LEAVE_GROUP_FAILURE, //탈퇴
  KICK_MEMBER_REQUEST, KICK_MEMBER_SUCCESS, KICK_MEMBER_FAILURE, // 강퇴
  TRANSFER_OWNERSHIP_REQUEST, TRANSFER_OWNERSHIP_SUCCESS, TRANSFER_OWNERSHIP_FAILURE, // 권한양도
  JOIN_GROUP_REQUEST, JOIN_GROUP_SUCCESS, JOIN_GROUP_FAILURE, //즉시가입
  APPLY_GROUP_REQUEST, APPLY_GROUP_SUCCESS, APPLY_GROUP_FAILURE, // 가입신청
  LOAD_JOIN_REQUESTS_REQUEST, LOAD_JOIN_REQUESTS_SUCCESS, LOAD_JOIN_REQUESTS_FAILURE, // 신청현황
  APPROVE_JOIN_REQUEST, APPROVE_JOIN_SUCCESS, APPROVE_JOIN_FAILURE, // 가입승인
  REJECT_JOIN_REQUEST, REJECT_JOIN_SUCCESS, REJECT_JOIN_FAILURE,//가입거절
  LOAD_USER_GROUPS_FAILURE, LOAD_USER_GROUPS_SUCCESS, LOAD_USER_GROUPS_REQUEST, 
} from '@/reducers/group';

// 알림
import { ADD_NOTIFICATION_REQUEST } from '@/reducers/notification';
import NOTIFICATION_TYPE from '../../shared/constants/NOTIFICATION_TYPE';

// 1. 그룹 로드
function loadGroupsAPI() { return axios.get('/groups'); }
function* loadGroups() {
  try {
    const result = yield call(loadGroupsAPI);
    yield put({ type: LOAD_GROUPS_SUCCESS, data: result.data });
  } catch (err) { yield put({ type: LOAD_GROUPS_FAILURE, error: err.response ? err.response.data : err.message }); }
}
function* watchLoadGroups() { yield takeLatest(LOAD_GROUPS_REQUEST, loadGroups); }

// 2. 그룹 생성
function createGroupAPI(data) {  return axios.post('/groups', data, {    withCredentials: true,  });   }
function* createGroup(action) {
  try {
    const result = yield call(createGroupAPI, action.data);
    
    // 그룹 생성 성공 후 알림
    notification.success({ message: '그룹 생성 완료',description: '그룹이 성공적으로 생성되었습니다.', });

    // CREATE_GROUP_SUCCESS 액션 디스패치 후 리디렉션
    yield put({ type: CREATE_GROUP_SUCCESS, data: result?.data });

    window.location.href = '/groups';  // 강제로 리디렉션
  } catch (err) {
    yield put({ type: CREATE_GROUP_FAILURE, error: err.response.data });
    notification.error({message: '그룹 생성 실패', description: '그룹 생성 중 오류가 발생했습니다.', });
  }
}
function* watchCreateGroup() { yield takeLatest(CREATE_GROUP_REQUEST, createGroup); }

// 3-0 단일그룹 불러오기
function loadSingleGroupApi(groupId) { return axios.get(`/groups/${groupId}`); }
function* loadSingleGroup(action) {
  try {
    const result = yield call(loadSingleGroupApi, action.data);
    yield put({ type: LOAD_SINGLE_GROUP_SUCCESS, data: result.data });
  } catch (err) { yield put({ type: LOAD_SINGLE_GROUP_FAILURE, error: err.response ? err.response.data : err.message }); }
};
function* watchLoadSingleGroup() { yield takeLatest(LOAD_SINGLE_GROUP_REQUEST, loadSingleGroup); }

// 3. 그룹 수정
function updateGroupAPI(data) { return axios.patch(`/groups/${data.groupId}`, data); }
function* updateGroup(action) {
  try {
    const result = yield call(updateGroupAPI, action.data);
    yield put({ type: UPDATE_GROUP_SUCCESS, data: result.data });
  } catch (err) { yield put({ type: UPDATE_GROUP_FAILURE, error: err.response.data }); }
}
function* watchUpdateGroup() { yield takeLatest(UPDATE_GROUP_REQUEST, updateGroup); }

// 4. 그룹 삭제
function deleteGroupAPI(groupId) { return axios.delete(`/groups/${groupId}`); }
function* deleteGroup(action) {
  try {
    yield call(deleteGroupAPI, action.data);
    yield put({ type: DELETE_GROUP_SUCCESS, data: action.data });
  } catch (err) { yield put({ type: DELETE_GROUP_FAILURE, error: err.response.data }); }
}
function* watchDeleteGroup() { yield takeLatest(DELETE_GROUP_REQUEST, deleteGroup); }

//멤버관리--------------------------------------------------------------------
//1. 멤버 불러오기
function loadMembersAPI(groupId) { return axios.get(`/api/groups/${groupId}/members`); }
function* loadMembers(action) {
  try {
    const result = yield call(loadMembersAPI, action.data);
    yield put({ type: LOAD_MEMBERS_SUCCESS, data: result.data });
  } catch (err) { yield put({ type: LOAD_MEMBERS_FAILURE, error: err.response.data }); }
}
function* watchLoadMembers() { yield takeLatest(LOAD_MEMBERS_REQUEST, loadMembers); }

// 멤버 탈퇴
function leaveGroupAPI({groupId}){return axios.delete(`/groups/${groupId}/leave`); }
function*leaveGroup(action){
  try{
    yield call(leaveGroupAPI, action.data);
    yield put({type: LEAVE_GROUP_SUCCESS, data:action.data.userId})
  }catch(err){yield put({type: LEAVE_GROUP_FAILURE, error: err.response.data});}
}
function* watchLeaveGroup(){yield takeLatest(LEAVE_GROUP_REQUEST, leaveGroup)}

//2. 멤버 강퇴
function kickMemberAPI({ groupId, userId }) { return axios.delete(`/api/groups/${groupId}/members/${userId}`); }
function* kickMember(action) {
  try {
    yield call(kickMemberAPI, action.data);
    yield put({ type: KICK_MEMBER_SUCCESS, data: action.data.userId })
  } catch (err) { yield put({ type: KICK_MEMBER_FAILURE, error: err.response.data }); }
}
function* watchKickMember() { yield takeLatest(KICK_MEMBER_REQUEST, kickMember); }

//3. 권한위임
function transferOwnershipAPI({ groupId, userId }) { return axios.patch(`/api/groups/${groupId}/members/${userId}/transfer`); }
function* transferOwnership(action) {
  try {
    yield call(transferOwnershipAPI, action.data);
    yield put({ type: TRANSFER_OWNERSHIP_SUCCESS, data: action.data.userId })
  } catch (err) { yield put({ type: TRANSFER_OWNERSHIP_FAILURE, error: err.response.data }); }
}
function* watchTransferOwnership() { yield takeLatest(TRANSFER_OWNERSHIP_REQUEST, transferOwnership); }

//가입-----------------------------------------------------------------------------------
//1. 공개그룹 즉시가입
function joinGroupAPI(data) { return axios.post(`/api/groups/${data.groupId}/join`); }
function* joinGroup(action) {
  try {
    yield call(joinGroupAPI, action.data);
    yield put({ type: JOIN_GROUP_SUCCESS });
    yield put({
      type: ADD_NOTIFICATION_REQUEST,
      data: {
        notiType: NOTIFICATION_TYPE.GROUPAPPLY,
        SenderId: action.notiData.SenderId,
        ReceiverId: action.notiData.ReceiverId,
        targetId: action.notiData.targetId,
      }
    });
    notification.success({
      message: "가입 완료",
      description: "가입이 완료되었습니다.",
      placement: "topRight",
    });    
    // E 알림
  } catch (err) { yield put({ type: JOIN_GROUP_FAILURE, error: err.response.data || err.message }); }
}
function* watchJoinGroup() { yield takeLatest(JOIN_GROUP_REQUEST, joinGroup) }

//2. 비공개그룹 가입처리
function applyGroupAPI(data) {return axios.post(`/api/groups/${data.groupId}/apply`); }
function* applyGroup(action) {
  try {
    yield call(applyGroupAPI, action.data);
    yield put({ type: APPLY_GROUP_SUCCESS, message: "가입 신청이 완료되었습니다!" });
    // 알림
    yield put({
      type: ADD_NOTIFICATION_REQUEST,
      data: {
        notiType: NOTIFICATION_TYPE.GROUPAPPLY,
        SenderId: action.notiData.SenderId,
        ReceiverId: action.notiData.ReceiverId,
        targetId: action.notiData.targetId,
      }
    });
    notification.success({
      message: "가입 신청 완료",
      description: "가입 신청이 완료되었습니다!",
      placement: "topRight",
    });    
    // E 알림
  } catch (err) { yield put({ type: APPLY_GROUP_FAILURE, error: err.response.data || err.message }) }
}
function* watchApplyGroup() { yield takeLatest(APPLY_GROUP_REQUEST, applyGroup) }
// --
// 3.가입 요청 불러오기
function loadJoinRequestsAPI(groupId) { return axios.get(`/api/groups/${groupId}/requests`); }
function* loadJoinRequests(action) {
  try {
    const result = yield call(loadJoinRequestsAPI, action.data);
    yield put({ type: LOAD_JOIN_REQUESTS_SUCCESS, data: result.data });
  } catch (err) { yield put({ type: LOAD_JOIN_REQUESTS_FAILURE, error: err.response.data }); }
}
function* watchLoadJoinRequests() { yield takeLatest(LOAD_JOIN_REQUESTS_REQUEST, loadJoinRequests); }

// 4. 승인
function approveJoinAPI(groupId, requestId, userId) { return axios.post(`/api/groups/${groupId}/requests/${requestId}/approve?userId=${userId}`); }
function* approveJoin(action) {
  try {
    const { groupId, requestId, userId } = action.data;

    const response = yield call(axios.get, `/api/groups/${groupId}/requests`);
    const request = response.data.find((req) => req.id === requestId);

    if (!request) { throw new Error('해당 요청을 찾을 수 없습니다.'); }

    yield call(approveJoinAPI, groupId, request.id, userId);
    yield put({ type: APPROVE_JOIN_SUCCESS, data: requestId });
    yield put({
      type: ADD_NOTIFICATION_REQUEST,
      data: {
        notiType: NOTIFICATION_TYPE.GROUPAPPLY_APPROVE,
        SenderId: action.notiData.SenderId,
        ReceiverId: action.notiData.ReceiverId,
        targetId: action.notiData.targetId,
      }
    });
    // E 알림
  } catch (err) {
    const error = (err.response ? err.response.data : err.message);
    yield put({ type: APPROVE_JOIN_FAILURE, error });
  }
}
function* watchApproveJoin() { yield takeLatest(APPROVE_JOIN_REQUEST, approveJoin); }

// 5. 거절
function rejectJoinAPI(groupId, requestId, userId) {
  return axios.post(`/api/groups/${groupId}/requests/${requestId}/reject?userId=${userId}`);
} 

function* rejectJoin(action) {
  try {
    const { groupId, requestId, userId } = action.data;
    const response = yield call(axios.get, `/api/groups/${groupId}/requests`);

    const request = response.data.find((req) => req.id === requestId);

    if (!request) { throw new Error('해당 요청을 찾을 수 없습니다.'); }

    yield call(rejectJoinAPI, groupId, request.id, userId);
    yield put({ type: REJECT_JOIN_SUCCESS, data: requestId });
    // 알림
    yield put({
      type: ADD_NOTIFICATION_REQUEST,
      data: {
        notiType: NOTIFICATION_TYPE.GROUPAPPLY_REJECT,
        SenderId: action.notiData.SenderId,
        ReceiverId: action.notiData.ReceiverId,
        targetId: action.notiData.targetId,
      }
    });
    // E 알림
  } catch (err) {
    const error = (err.response ? err.response.data : err.message);
    yield put({ type: REJECT_JOIN_FAILURE, error });
  }
}
function* watchRejectJoin() { yield takeLatest(REJECT_JOIN_REQUEST, rejectJoin); }

//6. 로그인한 유저가 가입된 그룹 리스트 불러오기
function loadUserGroupsAPI(){return axios.get('/api/groups/mygroups',{withCredentials:true});}
function* loadUserGroups(){
  try{
    const response = yield call(loadUserGroupsAPI);
    
    yield put({ type: LOAD_USER_GROUPS_SUCCESS , data: response.data });
  }catch(err){
    yield put({type: LOAD_USER_GROUPS_FAILURE, error: err});  }
}
function* watchLoadUserGroups(){ yield takeLatest(LOAD_USER_GROUPS_REQUEST, loadUserGroups); }


// root saga
export default function* groupSaga() {
  yield all([
    fork(watchLoadGroups),
    fork(watchCreateGroup),
    fork(watchUpdateGroup),
    fork(watchDeleteGroup),
    fork(watchLoadSingleGroup),
    fork(watchLoadMembers),
    fork(watchKickMember),
    fork(watchTransferOwnership),
    fork(watchJoinGroup),
    fork(watchApplyGroup),
    fork(watchLoadJoinRequests),
    fork(watchApproveJoin),
    fork(watchRejectJoin),
    fork(watchLoadUserGroups),
    fork(watchLeaveGroup)
  ]);
}
