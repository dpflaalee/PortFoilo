const express = require('express');
const router = express.Router();

const { Post, User, Group, Image, Comment, OpenScope, Category, Blacklist, Complain } = require('../models');
const { Op } = require('sequelize');
const TARGET_TYPE = require('../../shared/constants/TARGET_TYPE');


router.get('/:searchInput', async (req, res, next) => {
    const keyword = req.params.searchInput;
    const myId = req.user?.id;
    if (!myId) {
        return res.status(401).send('로그인 필요');
    }

    try {
        const blockedMeUsers = await Blacklist.findAll({
            where: { BlockedId: myId },
            attributes: ['BlockingId'],
        });
        const blockingIds = blockedMeUsers.map(entry => entry.BlockingId);

        const blindedUser = await Complain.findAll({
            where: {
                isBlind: true,
                targetType: TARGET_TYPE.USER,
            },
            attributes: ['targetId'],
        });
        const blindedUserIds = blindedUser.map(entry => entry.targetId);

        const complainPost = await Complain.findAll({
            where: {
                isBlind: true,
                targetType: TARGET_TYPE.POST,
            },
            attributes: ['targetId'],
        });
        const complainPostIds = complainPost.map(entry => entry.targetId);

        const excludedUserIds = [...new Set([...blockingIds, ...blindedUserIds])];

        const postResults = await Post.findAll({
            where: {
                content: { [Op.like]: `%${keyword}%` },
                UserId: { [Op.notIn]: excludedUserIds },
                id: { [Op.notIn]: complainPostIds },
            },
            include: [
                { model: User, attributes: ['id', 'nickname', 'isAdmin'] },
                { model: Image },
                { model: Comment, include: [{ model: User, attributes: ['id', 'nickname', 'isAdmin'] }] },
                { model: User, as: 'Likers', attributes: ['id'] },
                { model: Post, as: 'Retweet', include: [{ model: User, attributes: ['id', 'nickname'] }, { model: Image }] },
                { model: OpenScope }
            ]
        });

        const groupResults = await Group.findAll({
            where: {
                title: { [Op.like]: `%${keyword}%` },
            },
            include: [
                { model: Category, through: { attributes: [] } }
                , { model: OpenScope, attributes: ['id', 'content'] }
                , { model: User, as: 'groupmembers', attributes: ['id'], through: { attributes: [] } }
            ]
        });

        const memberResults = await User.findAll({
            where: {
                nickname: { [Op.like]: `%${keyword}%` },
                id: { [Op.notIn]: excludedUserIds },
            },
            include: [
                {
                    model: User,
                    as: 'Blocked',
                    attributes: ['id'],
                    through: { attributes: [] },
                },
            ],
        });

        res.json({
            post: postResults,
            group: groupResults,
            member: memberResults,
        });
    } catch (err) {
        res.status(500).send('검색 실패');
    }

});


module.exports = router;
