import React, { useEffect } from "react";
import { List, Avatar, Button, Space, Tag } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { APPROVE_JOIN_REQUEST, REJECT_JOIN_REQUEST, LOAD_JOIN_REQUESTS_REQUEST, } from "@/reducers/group";

const GroupJoinRequests = ({ groupId }) => {
  const dispatch = useDispatch();

  const { joinRequests, joinRequestsLoading, joinRequestsError } = useSelector((state) => state.group);
  const me = useSelector(state => state.user);
  useEffect(() => {
    if (groupId) {
      dispatch({ type: LOAD_JOIN_REQUESTS_REQUEST, data: groupId, });
    }
  }, [groupId, dispatch]);

  const handleApprove = (requestId, userId) => {
    dispatch({ type: APPROVE_JOIN_REQUEST, data: { groupId, requestId, userId }, notiData: { SenderId: me.user?.id, ReceiverId: userId, targetId: groupId } });
  };

  const handleReject = (requestId, userId) => {
    dispatch({ type: REJECT_JOIN_REQUEST, data: { groupId, requestId, userId }, notiData: { SenderId: me.user?.id, ReceiverId: userId, targetId: groupId } });
  };

  if (joinRequestsLoading) return <div>로딩 중...</div>;
  if (joinRequestsError) return <div>에러 발생!</div>;

  return (
    <List
      style={{ padding: "0 15px" }}
      itemLayout="horizontal"
      dataSource={joinRequests}
      renderItem={(user) => (
        <List.Item
          actions={
            user.status === "pending"
              ? [
                <Button
                  key="approve"
                  type="primary"
                  onClick={() => handleApprove(user.id, user.userId)}
                >
                  승인
                </Button>,
                <Button
                  key="reject"
                  danger
                  onClick={() => handleReject(user.id, user.userId)}
                >
                  거절
                </Button>,
              ]
              : [
                <Tag color={user.status === "approved" ? "green" : "red"}>
                  {user.status === "approved" ? "승인됨" : "거절됨"}
                </Tag>,
              ]
          }
        >
          <List.Item.Meta
            avatar={<Avatar src={user.avatar} />}
            title={user.nickname}
          />
        </List.Item>
      )}
    />
  );
};

export default GroupJoinRequests;
