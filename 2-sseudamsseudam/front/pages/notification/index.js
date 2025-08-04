import React, { useState, useEffect } from "react";
import AppLayout from "../../components/AppLayout";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import 'antd/dist/antd.css';
import { Tabs, Button, Modal } from 'antd';
import groupBy from 'lodash/groupBy';
import Notification from "@/components/notifications/Notification";
import NotificationSetting from '@/components/notifications/NotificationSetting';

import {
    LOAD_NOTIFICATION_REQUEST,
    READ_ALL_NOTIFICATION_REQUEST,
    REMOVE_NOTIFICATION_REQUEST,
} from "@/reducers/notification";
import NOTIFICATION_TYPE from "../../../shared/constants/NOTIFICATION_TYPE";

const { TabPane } = Tabs;

const typeLabels = {
    [NOTIFICATION_TYPE.LIKE]: '❤️ 좋아요',
    [NOTIFICATION_TYPE.RETWEET]: '🔁 리트윗',
    [NOTIFICATION_TYPE.COMMENT]: '💬 댓글',
    [NOTIFICATION_TYPE.FOLLOW]: '➕ 팔로우',
    [NOTIFICATION_TYPE.RECOMMENT]: '💬 답글',
    [NOTIFICATION_TYPE.RANDOMBOX]: '🎁 랜덤박스',
    [NOTIFICATION_TYPE.GROUPAPPLY]: '👥 그룹 신청',
    [NOTIFICATION_TYPE.GROUPAPPLY_APPROVE]: '✅ 가입 승인',
    [NOTIFICATION_TYPE.GROUPAPPLY_REJECT]: '❌ 가입 거절',
    [NOTIFICATION_TYPE.ADMIN_NOTI]: '📢 관리자 알림',
    [NOTIFICATION_TYPE.ANIMAL_FRIENDS]: '👑 친구 요청',
};

const NotificationPage = () => {
    const dispatch = useDispatch();
    const { mainNotification } = useSelector((state) => state.notification);
    const userId = useSelector((state) => state.user.user?.id);
    const grouped = groupBy(mainNotification, 'type');

    const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

    useEffect(() => {
        if (userId) {
            dispatch({ type: LOAD_NOTIFICATION_REQUEST, data: userId });
            dispatch({ type: READ_ALL_NOTIFICATION_REQUEST, data: userId });
            axios.patch('/notification/readAll', { userId }).catch(console.error);
        }
    }, [userId]);

    const handleDelete = (id) => {
        dispatch({ type: REMOVE_NOTIFICATION_REQUEST, data: id });
    };

    return (
        <AppLayout>
            <Button onClick={() => setIsSettingModalOpen(true)} type="default" size="middle">
                ⚙ 알림 설정
            </Button>
            <Modal
                title="🔔 알림 설정"
                open={isSettingModalOpen}
                onCancel={() => setIsSettingModalOpen(false)}
                footer={null}
                width={500}
            >
                <NotificationSetting />
            </Modal>

            <Tabs defaultActiveKey="all">
                <TabPane tab="📬 전체" key="all">
                    {mainNotification.map((noti) => (
                        <Notification key={noti.id} noti={noti} onDelete={handleDelete} />
                    ))}
                </TabPane>

                {Object.entries(typeLabels).map(([type, label]) => (
                    <TabPane tab={label} key={type}>
                        {(grouped[type] || []).map((noti) => (
                            <Notification key={noti.id} noti={noti} onDelete={handleDelete} />
                        ))}
                    </TabPane>
                ))}
            </Tabs>
        </AppLayout>
    );
};

export default NotificationPage;
