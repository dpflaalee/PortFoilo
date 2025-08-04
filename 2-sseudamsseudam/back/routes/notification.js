const express = require('express');
const router = express.Router();

const { Post, User, Group, Notification, Animal, Comment, Prize, NotificationSetting, MyPrize } = require('../models');
const NOTIFICATION_TYPE = require('../../shared/constants/NOTIFICATION_TYPE');
const { Op } = require('sequelize');
const { isLoggedIn } = require('./middlewares');

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        if (req.body.notiType === NOTIFICATION_TYPE.ADMIN_NOTI) {
            const users = await User.findAll({
                attributes: ['id'],
            });

            const notifications = await Promise.all(
                users.map((user) =>
                    Notification.create({
                        type: req.body.notiType,
                        targetId: req.body.targetId,
                        SenderId: req.body.SenderId,
                        ReceiverId: user.id,
                    })
                )
            );

            return res.status(201).json({
                message: `${notifications.length}명에게 관리자 공지 알림 발송 완료`,
            });
        }

        // 일반 알림 처리
        const notification = await Notification.create({
            type: req.body.notiType,
            targetId: req.body.targetId,
            SenderId: req.body.SenderId,
            ReceiverId: req.body.ReceiverId,
        });

        const fullNotification = await Notification.findOne({
            where: { id: notification.id },
            include: [
                { model: User, as: 'Sender', attributes: ['id', 'nickname'] },
                { model: User, as: 'Receiver', attributes: ['id', 'nickname'] },
            ],
        });

        res.status(201).json(fullNotification);
    } catch (err) {
        res.status(500).send('알림 실패');
    }
});




// 알림 보기
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: '잘못된 사용자 정보입니다.' });
        }

        // 1. 비활성화된 알림 타입 가져오기
        const disabledSettings = await NotificationSetting.findAll({
            where: {
                UserId: userId,
                enabled: false,
            },
            attributes: ['type'],
        });

        const disabledTypes = disabledSettings.map((s) => s.type);

        // 2. 알림 가져오기 (꺼진 알림 타입 제외)
        const notifications = await Notification.findAll({
            where: {
                ReceiverId: userId,
                ...(disabledTypes.length > 0 && {
                    type: { [Op.notIn]: disabledTypes },
                }),
            },
            include: [
                { model: User, as: 'Sender', attributes: ['id', 'nickname'] },
                { model: User, as: 'Receiver', attributes: ['id', 'nickname'] },
            ],
            order: [['createdAt', 'DESC']],
        });

        const enriched = await Promise.all(
            notifications.map(async (noti) => {
                let target = null;

                switch (noti.type) {
                    case NOTIFICATION_TYPE.COMMENT:
                    case NOTIFICATION_TYPE.RECOMMENT:
                        target = await Comment.findByPk(noti.targetId, {
                            include: [
                                { model: User, attributes: ['id', 'nickname'] },
                                { model: Post, attributes: ['id'] },
                            ],
                        });
                        break;

                    case NOTIFICATION_TYPE.LIKE:
                    case NOTIFICATION_TYPE.RETWEET:
                        target = await Post.findByPk(noti.targetId, {
                            include: [
                                { model: User, attributes: ['id', 'nickname'] },
                                {
                                    model: Post,
                                    as: 'Retweet',
                                    include: [{ model: User, attributes: ['id', 'nickname'] }],
                                },
                            ],
                        });
                        break;

                    case NOTIFICATION_TYPE.FOLLOW:
                        target = await User.findByPk(noti.targetId, {
                            attributes: ['id', 'nickname'],
                        });
                        break;

                    case NOTIFICATION_TYPE.GROUPAPPLY:
                    case NOTIFICATION_TYPE.GROUPAPPLY_APPROVE:
                    case NOTIFICATION_TYPE.GROUPAPPLY_REJECT:
                        target = await Group.findByPk(noti.targetId);
                        break;

                    case NOTIFICATION_TYPE.ADMIN_NOTI:
                        target = await Post.findByPk(noti.targetId, {
                            include: [{ model: User, attributes: ['id', 'nickname'] }],
                        });
                        break;

                    case NOTIFICATION_TYPE.ANIMAL_FRIENDS:
                        target = await Animal.findByPk(noti.targetId, {
                            include: [{ model: Animal, as: 'Followers', attributes: ['id', 'aniName'] }],
                        })
                        break;

                    case NOTIFICATION_TYPE.RANDOMBOX:
                        target = await MyPrize.findByPk(Number(noti.targetId), {
                            include: [
                                { model: Prize, as: 'prize', attributes: ['id', 'content'] },
                                { model: User, as: 'user', attributes: ['id', 'nickname'] },
                            ],
                        });
                        break;
                }


                return {
                    ...noti.toJSON(),
                    targetObject: target,
                };
            })
        );

        res.status(200).json(enriched);
    } catch (err) {
        res.status(500).send('알림 조회 실패');
    }
});

// 알림 읽음 처리
// 전체 알림 읽음 처리
router.patch('/readAll', isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: '잘못된 사용자 정보입니다.' });
        }

        await Notification.update(
            { isRead: true },
            { where: { ReceiverId: userId } }
        );

        res.status(200).json({ message: '모든 알림 읽음 처리 완료' });
    } catch (err) {
        res.status(500).send('전체 읽음 처리 실패');
    }
});

// 알림 삭제
router.delete('/:id', async (req, res, next) => {
    try {
        await Notification.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json({ message: '알림 삭제 완료', id: req.params.id });
    } catch (err) {
        res.status(500).send('알림 삭제 실패');
    }
});

// 알림 설정 불러오기 (기본값 true 보완 포함)
router.get('/notificationSetting/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId, 10);

        const settings = await NotificationSetting.findAll({
            where: { userId },
            attributes: ['type', 'enabled'],
        });

        const settingMap = {};
        settings.forEach((s) => {
            settingMap[s.type] = s.enabled;
        });

        const fullSettings = Object.entries(NOTIFICATION_TYPE).map(([key, typeValue]) => ({
            type: typeValue,
            enabled: settingMap.hasOwnProperty(typeValue) ? settingMap[typeValue] : true,
        }));

        res.status(200).json(fullSettings);
    } catch (err) {
        res.status(500).send('알림 설정 불러오기 실패');
    }
});

// 알림 설정 갱신하기
router.patch('/notificationSetting/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { type, enabled } = req.body;

        const existing = await NotificationSetting.findOne({
            where: { UserId: userId, type: type },
        });

        if (existing) {
            await NotificationSetting.update(
                { enabled },
                { where: { UserId: userId, type: type } }
            );
        } else {
            // 없으면 create
            await NotificationSetting.create({
                type: type,
                enabled: enabled,
                UserId: userId
            });
        }

        res.status(200).json({ message: '알림 설정이 저장되었습니다', type, enabled });
    } catch (err) {
        res.status(500).send('알림 설정 저장 실패');
    }
});

module.exports = router;
