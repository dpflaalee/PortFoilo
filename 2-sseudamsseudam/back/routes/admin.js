const express = require('express');
const router = express.Router();
const TARGET_TYPE = require('./../../shared/constants/TARGET_TYPE');
const { Post, User, Image, Comment, Hashtag, Complain, MyPrize, Prize } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res, next) => {
    try {
        const admin = await User.findOne({ where: { isAdmin: true } });
        const adminNoti = await Post.findAll({
            where: { userId: admin.id },
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC']
            ],
            include: [
                {
                    model: User,
                    attributes: ['id', 'nickname']
                }, {
                    model: Image
                }, {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'nickname']
                        }
                    ]
                }, {
                    model: User, as: 'Likers',
                    attributes: ['id']
                }, {
                    model: Post, as: 'Retweet',
                    include: [{
                        model: User,
                        attributes: ['id', 'nickname']
                    }, {
                        model: Image
                    }]   
                }
            ]
        });
        if (!admin) {
            return res.status(404).json({ message: '관리자 계정을 찾을 수 없습니다.' });
        }
        res.status(200).json(adminNoti);
    } catch (err) {
        next(err);
    }
});

// 신고 내용 보기
router.get('/complain', async (req, res, next) => {
    try {
        const complainList = await Complain.findAll({
            include: [
                { model: User, as: 'Reporter', attributes: ['id', 'nickname'] },
            ],
            order: [
                ['createdAt', 'DESC'],
            ],
        });

        const enriched = await Promise.all(
            complainList.map(async (complain) => {
                let target = null;

                switch (complain.targetType) {
                    case TARGET_TYPE.POST:
                        target = await Post.findByPk(Number(complain.targetId), {
                            include: [{ model: User, attributes: ['id', 'nickname'] }, { model: Image },],

                        });
                        break;
                    case TARGET_TYPE.COMMENT:
                        target = await Comment.findByPk(Number(complain.targetId), {
                            include: [{ model: User, attributes: ['id', 'nickname'] }],
                        });
                        break;
                    case TARGET_TYPE.USER:
                        target = await User.findByPk(Number(complain.targetId), {
                            attributes: ['id', 'nickname', 'email'],
                        });
                        break;
                    case TARGET_TYPE.RANDOMBOX:
                        target = await MyPrize.findByPk(Number(complain.targetId), {
                            include: [{
                                model: Prize,
                                as: 'prize',
                                attributes: ['id', 'content']
                            }, {
                                model: User,
                                as: 'user',
                                attributes: ['id', 'nickname']
                            }]
                        });
                        break;
                }
                return {
                    ...complain.toJSON(),
                    targetObject: target ?? null
                };
            })
        );

        res.status(200).json(enriched);
    } catch (err) {
        res.status(500).send('알림 조회 실패');
    }
});

module.exports = router;
