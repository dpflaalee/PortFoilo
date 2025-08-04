const express = require('express');
const router = express.Router();
const { Post, User, Image, Comment, OpenScope, Category, Blacklist, UserProfileImage } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res, next) => {
  try {
    const where = {};

    const userId = req.query.userId;
    const number = req.query.number;
    const lastId = parseInt(req.query.lastId, 10);

    if (lastId) {
      where.id = { [Op.lt]: lastId };
    }

    if (userId === 'undefined' && number === '1' && req.user) {
      where.UserId = req.user.id;
    }

    if (userId && userId !== 'undefined' && number === '2' && req.user) {
      where.UserId = parseInt(userId, 10);
    }

    if (req.user) {
      const blockedUsers = await Blacklist.findAll({
        where: {
          [Op.or]: [
            { BlockingId: req.user.id },  
            { BlockedId: req.user.id },   
          ],
        },
      });

      const blockedUserIds = blockedUsers.map(b => 
        b.BlockingId === req.user.id ? b.BlockedId : b.BlockingId
      );

if (req.user && blockedUserIds.length > 0) {
  const filteredBlockedUserIds = blockedUserIds.filter(id => id !== req.user.id);

  if (where.UserId) {
    if (filteredBlockedUserIds.includes(where.UserId)) {
      where.UserId = -1;
    }
  } else {
    where.UserId = { [Op.notIn]: filteredBlockedUserIds };
  }
}
    }

    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC']
      ],
      include: [
        { model: User, attributes: ['id', 'nickname', 'isAdmin'] 
          , include: [{model:UserProfileImage}]
        },
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ['id', 'nickname', 'isAdmin'] }],
        },
        { model: User, as: 'Likers', attributes: ['id'] },
        {
          model: Post,
          as: 'Retweet',
          include: [
            { model: User, attributes: ['id', 'nickname'] },
            { model: Image },
          ],
        },
        { model: OpenScope },
        {
          model: Category,
          as: 'Categorys',
          through: { attributes: [] },
          attributes: ['id', 'content', 'isAnimal'],
        },
      ],
    });

if (req.user) {
  const blockedUsers = await Blacklist.findAll({
    where: {
      [Op.or]: [
        { BlockingId: req.user.id },
        { BlockedId: req.user.id },
      ],
    },
  });

  const blockedUserIds = blockedUsers.map(b =>
    b.BlockingId === req.user.id ? b.BlockedId : b.BlockingId
  );

  posts.forEach((post) => {
    if (post.Retweet && post.Retweet.User) {
      const retweetUserId = post.Retweet.User.id;
      if (blockedUserIds.includes(retweetUserId)) {
        post.Retweet.dataValues.isBlocked = true;
      }
    }
  });
}
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
