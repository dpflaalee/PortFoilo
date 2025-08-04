import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Typography, Button, Card, Space, Spin, notification } from "antd";
import GroupDropDown from "./GroupDropdown";
import { LOAD_MEMBERS_REQUEST, APPLY_GROUP_REQUEST, JOIN_GROUP_REQUEST,} from "@/reducers/group";
import { ADD_NOTIFICATION_REQUEST } from '../../reducers/notification';
import NOTIFICATION_TYPE from "../../../shared/constants/NOTIFICATION_TYPE";

const { Title, Text } = Typography;

export default function GroupList({ g }) {
  const router = useRouter(); const dispatch = useDispatch();
  const { members, loadMembersLoading, loadMembersError } = useSelector((state) => state.group)
  const [isMember, setIsMember] = useState(false);
  const [groupLeader, setGroupLeader] = useState(false);
  const { user } = useSelector(state => state.user); 
  const [group, setGroup] = useState(g);
  const [open, setOpen] = useState(false);
  const { joinGroupDone, applyGroupDone, } = useSelector(state => state.group);

  const formattedCategory = group?.Categories?.map((c) => c.content).join(", ") || "없음"; // 카테고리 공백 추가  
  const memberCount = group?.groupmembers ? new Set(group.groupmembers.map(m => m.id)).size : 0;//멤버 수 계산

  useEffect(() => {
    if (group && group?.id) { dispatch({ type: LOAD_MEMBERS_REQUEST, data: group?.id }); }
  }, [group?.id, dispatch]);

  useEffect(() => {
    if (members && members.length > 0) {
      const memberFound = group?.groupmembers?.some((groupMember) => groupMember.id === user.id);
      setIsMember(memberFound);
    }
    if (group?.groupmembers && group?.groupmembers.length > 0) {
      const groupLeader = members.find((members) => members.isLeader === true); // GroupMember의 isLeader 확인
      setGroupLeader(groupLeader);
    }
  }, [members, user, group?.groupmembers]);

  if (joinGroupDone || applyGroupDone) { router.push(`/groups/${g.id}`);  }
  
  const handleGroupClick = () => { setOpen((prev) => !prev); };

  const handleEnterGroup = (e) => { e.stopPropagation(); router.push(`/groups/${group.id}`); } // 가입한 그룹일 시 해당 그룹으로 이동

  const handleJoin = async (e) => {
    e.stopPropagation();
    if (isMember) { 
      notification.info({ message: "이미 가입된 그룹입니다.", placement: "topRight" });
      return router.push(`/groups/${group.id}`); };

    try {
      if (group.OpenScopeId === 1) {
        dispatch({
          type: JOIN_GROUP_REQUEST, data: { groupId: group.id },
          notiData: {
            targetId: group.id,
            SenderId: user?.id,
            ReceiverId: groupLeader.id,
          }
        });
      } else {
        dispatch({
          type: APPLY_GROUP_REQUEST, data: { groupId: group.id },
          notiData: {
            targetId: group.id,
            SenderId: user?.id,
            ReceiverId: groupLeader.id,
          }
        });
      }

    } catch (error) { alert("가입 중 오류발생"); }
  };


  //////////////////////////////////////////////////////////////////////////////////////
  return (
    <Card
      onClick={handleGroupClick}
      style={{ width: "100%", marginBottom: 8 }}
      bodyStyle={{ padding: 16 }}
    >
      {loadMembersLoading ? (<Spin size="large" />) : loadMembersError ? (<div>Error:{loadMembersError}</div>) : (
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={4}>
              <Row align="middle" gutter={8}>
                <Col>
                  <Title level={5} style={{ margin: 0 }}>
                    {group?.title}
                  </Title>
                </Col>
                <Col>
                  <Text type="secondary">멤버 수: {memberCount}</Text>
                </Col>
              </Row>
              <Text type="secondary">카테고리: {formattedCategory}</Text>
            </Space>
          </Col>

          <Col>
            {isMember ? (
              <Button onClick={handleEnterGroup} style={{backgroundColor:'#6FE6FC', color:'#000', border:'none', fontWeight:'bold'}}> 이동하기 </Button>
            ) : (
              <Button type="primary" onClick={handleJoin}> 가입하기 </Button>
            )}
          </Col>
        </Row>
      )}  
      {open && (<div style={{ marginTop: 12 }}> <GroupDropDown group={group} /> </div>)}
    </Card>
  );
}
