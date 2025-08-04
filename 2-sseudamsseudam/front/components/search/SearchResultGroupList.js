import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Card, Row, Col, Typography, Button, Space } from "antd";
import GroupDropDown from "../groups/GroupDropdown";
import { JOIN_GROUP_REQUEST, APPLY_GROUP_REQUEST } from "@/reducers/group";

const { Title, Text } = Typography;

export default function SearchResultGroup({ g }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [isMember, setIsMember] = useState(false);
    const [open, setOpen] = useState(false);
    const [groupLeader, setGroupLeader] = useState(null);

    const handleGroupClick = () => {
        setOpen((prev) => !prev);
    };

    const formattedCategory = g?.Categories?.map((c) => c.content).join(", ") || "없음";
    const memberCount = g?.groupmembers?.length || 0;

    useEffect(() => {
        if (user?.id && Array.isArray(g?.groupmembers)) {
            const isMyGroup = g.groupmembers.some((m) => m.id === user.id);
            setIsMember(isMyGroup);

            const leader = g.groupmembers.find((m) => m.isLeader);
            setGroupLeader(leader || null);
        }
    }, [user, g]);

    const handleEnterGroup = (e) => {
        e.stopPropagation();
        router.push(`/groups/${g.id}`);
    };

    const handleJoin = async (e) => {
        e.stopPropagation();
        if (isMember) {
            alert("이미 가입된 그룹입니다. 그룹으로 이동합니다.");
            return router.push(`/groups/${g.id}`);
        }

        try {
            if (g.OpenScopeId === 1) {
                dispatch({
                    type: JOIN_GROUP_REQUEST,
                    data: { groupId: g.id },
                    notiData: {
                        targetId: g.id,
                        SenderId: user?.id,
                        ReceiverId: groupLeader?.id,
                    },
                });
            } else {
                dispatch({
                    type: APPLY_GROUP_REQUEST,
                    data: { groupId: g.id },
                    notiData: {
                        targetId: g.id,
                        SenderId: user?.id,
                        ReceiverId: groupLeader?.id,
                    },
                });
            }
        } catch (error) {
            alert("가입 중 오류 발생");
        }
    };

    return (
        <Card
            onClick={handleGroupClick}
            style={{ width: "100%", marginBottom: 8 }}
            bodyStyle={{ padding: 16 }}
        >
            <Row justify="space-between" align="middle">
                <Col>
                    <Space direction="vertical" size={4}>
                        <Row align="middle" gutter={8}>
                            <Col>
                                <Title level={5} style={{ margin: 0 }}>
                                    {g?.title}
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
                        <Button type="primary" onClick={handleEnterGroup}>
                            이동하기
                        </Button>
                    ) : (
                        <Button type="primary" onClick={handleJoin}>
                            가입하기
                        </Button>
                    )}
                </Col>
            </Row>

            {open && (
                <div style={{ marginTop: 12 }}>
                    <GroupDropDown group={g} />
                </div>
            )}
        </Card>
    );
}
