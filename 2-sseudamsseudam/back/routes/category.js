const express = require('express');
const router = express.Router();
const { Category } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'content', 'isAnimal'],
      order: [['content', 'ASC']]
    });
    res.status(200).json(categories);
  } catch (err) {  next(err); }
})

router.post('/', async (req, res, next) => {
  const { content, isAnimal } = req.body;

  if (!content) {
    return res.status(400).json({ message: '카테고리 이름을 입력하세요.' });
  }
  try {
    const newCategory = await Category.create({
      content,
      isAnimal: isAnimal || false,
    });

    return res.status(201).json({
      message: '카테고리 추가 성공',
      category: newCategory
    });
  } catch (err) {  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { content, isAnimal } = req.body;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: '해당 카테고리를 찾을 수 없습니다.' });
    }

    const updatedData = {};
    if (content !== undefined) updatedData.content = content;
    if (isAnimal !== undefined) updatedData.isAnimal = isAnimal;

    await category.update(updatedData);

    return res.status(200).json({ category });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
