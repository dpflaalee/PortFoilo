const express = require('express');
const router = express.Router();
const { Calendar } = require('../models'); 

router.get('/calendars', async (req, res) => {
  try {
    const calendars = await Calendar.findAll({
      attributes: ['id', 'title'],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(calendars);
  } catch (error) {
    res.status(500).json({ message: '서버 내부 오류 발생', detail: error.message });
  }
});

router.get('/', async (req, res, next) => {
  try {
    const calendars = await Calendar.findAll();
    res.json(calendars);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, content, startDate, endDate } = req.body;
    const newCalendar = await Calendar.create({
      title,
      content,
      startDate,
      endDate,
    });
    res.status(201).json(newCalendar);
  } catch (error) {
    res.status(500).json({ message: '일정 생성 실패', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Calendar.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ error: '일정이 존재하지 않습니다.' });
    }
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, content, startDate, endDate } = req.body;
    const calendar = await Calendar.findByPk(req.params.id);
    if (!calendar) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }
    await calendar.update({ title, content, startDate, endDate });
    res.json(calendar);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const calendar = await Calendar.findByPk(req.params.id);
    if (!calendar) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }
    await calendar.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});


module.exports = router;
