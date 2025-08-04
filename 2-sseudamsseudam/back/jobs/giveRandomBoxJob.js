const { User, Animal, Prize, Category, IssuedRandomBox, sequelize } = require('../models');
const cron = require('node-cron');

// 알림
const { Notification } = require('../models');
const NOTIFICATION_TYPE = require('../../shared/constants/NOTIFICATION_TYPE');
const { Op } = require('sequelize'); 

cron.schedule('0 9 * * 1', async () => {  
  try {
    // 좋아요 TOP3 게시글 보상 지급
    const top3Posts = await sequelize.models.Post.findAll({
      include: [
        { model: User, as: 'Likers', attributes: ['id'] },
        { model: User, attributes: ['id', 'username'] },
      ],
    });

    const sortedTopPosts = top3Posts
      .sort((a, b) => b.Likers.length - a.Likers.length)
      .slice(0, 3);

    const issuedUserIds = new Set();

    for (let i = 0; i < sortedTopPosts.length; i++) {
      const post = sortedTopPosts[i];
      const user = post.User;
      if (!user || issuedUserIds.has(user.id)) continue;

      issuedUserIds.add(user.id);
      const rank = i + 1;
      const issuedReason = `좋아요 ${rank}위`;

      const animals = await Animal.findAll({
        where: { UserId: user.id },
        attributes: ['id', 'CategoryId'],
      });

      if (!animals.length) continue;

      const selectedAnimal = animals[Math.floor(Math.random() * animals.length)];
      const categoryId = selectedAnimal.CategoryId;

      const prize = await Prize.findOne({
        where: {
          CategoryId: categoryId,
          quantity: { [Op.gt]: 0 },
          dueAt: { [Op.gt]: new Date() }
        },
        order: sequelize.random(),
        include: {
          model: Category,
          as: 'category',
          attributes: ['content'],
        }
      });

      if (!prize) continue;

      const issuedBox = await IssuedRandomBox.create({
        UserId: user.id,
        CategoryId: categoryId,
        issuedAt: new Date(),
        usedAt: null,
        issuedReason,
      });

      await Notification.create({
        type: NOTIFICATION_TYPE.RANDOMBOX,
        targetId: issuedBox.id,
        SenderId: 1,
        ReceiverId: user.id,
      });
    }
  } catch (error) {
    console.error('❌ 지급 중 오류 발생:', error);
  }
});
