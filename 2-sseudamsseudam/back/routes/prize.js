const express = require('express');
const router = express.Router();

const { Prize, Category } = require('../models');
const { isLoggedIn, isAdmin } = require('./middlewares'); // 관리자 인증 미들웨어 가정

router.post('/', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const { content, quantity, probability, dueAt, CategoryId } = req.body;
    const prize = await Prize.create({
      content,
      quantity,
      probability,
      dueAt,
      CategoryId
    });
    
    const fullPrize = await Prize.findByPk(prize.id, {
        include: [{ model: Category, as: 'category' }],
    });

    res.status(201).json(fullPrize);
  } catch (error) {
    next(error);
  }
});

router.get('/', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const prizes = await Prize.findAll({
      include: [{ model: Category, as: 'category' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(prizes);
  } catch (error) {
    next(error);
  }
});

router.get('/:prizeId', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const prize = await Prize.findOne({
      where: { id: req.params.prizeId },
      include: [{ model: Category, as: 'category' }]
    });
    if (!prize) return res.status(404).send('상품이 존재하지 않습니다.');
    res.json(prize);
  } catch (error) {
    next(error);
  }
});

router.patch('/:prizeId', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const { content, quantity, probability, dueAt, CategoryId } = req.body;
    const prize = await Prize.findOne({ where: { id: req.params.prizeId } });
    if (!prize) return res.status(404).send('상품이 존재하지 않습니다.');

    await prize.update({ content, quantity, probability, dueAt, CategoryId });


    const updatedPrize = await Prize.findByPk(prize.id, {
      include: [{ model: Category, as: 'category' }],
    });

    res.json(updatedPrize);
  } catch (error) {
    next(error);
  }
});

router.delete('/:prizeId', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const result = await Prize.destroy({ where: { id: req.params.prizeId } });
    if (!result) return res.status(404).send('상품이 존재하지 않습니다.');

    res.status(200).json({ message: '상품이 삭제되었습니다.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
