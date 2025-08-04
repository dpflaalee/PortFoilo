import React, { useEffect, useState } from 'react';
import { Checkbox, Spin, message, Card } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import NOTIFICATION_TYPE from '../../../shared/constants/NOTIFICATION_TYPE';

const typeLabels = {
    [NOTIFICATION_TYPE.LIKE]: '❤️ 좋아요 알림',
    [NOTIFICATION_TYPE.RETWEET]: '🔁 리트윗 알림',
    [NOTIFICATION_TYPE.COMMENT]: '💬 댓글 알림',
    [NOTIFICATION_TYPE.FOLLOW]: '➕ 팔로우 알림',
    [NOTIFICATION_TYPE.RECOMMNET]: '💬 답글 알림',
    [NOTIFICATION_TYPE.RANDOMBOX]: '🎁 랜덤박스 알림',
    [NOTIFICATION_TYPE.GROUPAPPLY]: '👥 그룹 신청',
    [NOTIFICATION_TYPE.GROUPAPPLY_APPROVE]: '✅ 그룹 승인',
    [NOTIFICATION_TYPE.GROUPAPPLY_REJECT]: '❌ 그룹 거절',
    [NOTIFICATION_TYPE.ADMIN_NOTI]: '📢 관리자 알림',
    [NOTIFICATION_TYPE.ANIMAL_FRIENDS]: '👑 친구 요청',
};

const NotificationSetting = () => {
    const userId = useSelector((state) => state.user.user?.id);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        axios
            .get(`notification/notificationSetting/${userId}`)
            .then((res) => {
                const result = {};
                res.data.forEach((setting) => {
                    result[setting.type] = setting.enabled;
                });
                setSettings(result);
            })
            .catch(() => {
                message.error('알림 설정을 불러오지 못했습니다.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId]);

    const handleChange = (type) => async (e) => {
        const enabled = e.target.checked;
        setSettings((prev) => ({ ...prev, [type]: enabled }));

        try {
            await axios.patch(`/notification/notificationSetting/${userId}`, {
                userId,
                type,
                enabled,
            });
            message.success(`${typeLabels[type]} ${enabled ? '활성화' : '비활성화'}됨`);
        } catch (err) {
            message.error('저장 실패');
        }
    };

    if (loading) return <Spin tip="불러오는 중..." />;

    return (
        <Card>
            {Object.entries(typeLabels).map(([type, label]) => (
                <div key={type} style={{ marginBottom: 12 }}>
                    <Checkbox
                        checked={settings[type] ?? true}
                        onChange={handleChange(type)}
                    >
                        {label}
                    </Checkbox>
                </div>
            ))}
        </Card>
    );
};

export default NotificationSetting;
