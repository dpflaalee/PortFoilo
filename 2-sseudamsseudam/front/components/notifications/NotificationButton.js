import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Notification from './Notification';
import NOTIFICATION_TYPE from '../../../shared/constants/NOTIFICATION_TYPE';
import { ADD_NOTIFICATION_REQUEST } from '@/reducers/notification'

const NotificationButton = () => {
    const [mainNotification, setNotifications] = useState([]);
    const sender = useSelector(state => state.user);
    const dispatch = useDispatch();


    // 알림 타입별로 버튼 클릭 시 해당 알림을 추가하는 함수
    const handleNotificationClick = (notiType) => {
        dispatch({
            type: ADD_NOTIFICATION_REQUEST,
            data: {
                notiType: notiType,
                SenderId: sender.user.id,
                ReceiverId: sender.user.id,
                targetId: 2,
            }
        });
    };

    return (
        <div>
            <div>
                <button onClick={() => handleNotificationClick(NOTIFICATION_TYPE.LIKE)}>
                    좋아요 알림
                </button>
                <button onClick={() => handleNotificationClick(NOTIFICATION_TYPE.RETWEET)}>
                    리트윗 알림
                </button>
                <button onClick={() => handleNotificationClick(NOTIFICATION_TYPE.COMMENT)}>
                    댓글 알림
                </button>
                <button onClick={() => handleNotificationClick(NOTIFICATION_TYPE.FOLLOW)}>
                    팔로우 알림
                </button>
                <button onClick={() => handleNotificationClick(NOTIFICATION_TYPE.RECOMMNET)}>
                    답글 알림
                </button>
                <button onClick={() => handleNotificationClick(NOTIFICATION_TYPE.RANDOMBOX)}>
                    랜덤박스 알림
                </button>
                <button onClick={() => handleNotificationClick(NOTIFICATION_TYPE.GROUPAPPLY)}>
                    그룹 신청 알림
                </button>
                <button onClick={() => handleNotificationClick(NOTIFICATION_TYPE.GROUPAPPLY_APPROVE)}>
                    그룹 승인 알림
                </button>
                <button onClick={() => handleNotificationClick(NOTIFICATION_TYPE.GROUPAPPLY_REJECT)}>
                    그룹 거절 알림
                </button>
                <button onClick={() => handleNotificationClick(NOTIFICATION_TYPE.ADMIN_NOTI)}>
                    관리자 알림
                </button>
                <button onClick={() => handleNotificationClick(NOTIFICATION_TYPE.ANIMAL_FRIENDS)}>
                    동물친구 알림
                </button>
            </div>

            <div>
                {mainNotification.map((noti, index) => (
                    <Notification
                        key={index}
                        notiType={noti.notiType}
                        sender={noti.sender}
                        reciever={noti.reciever}
                        target={noti.target}
                        content={noti.content}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotificationButton;
