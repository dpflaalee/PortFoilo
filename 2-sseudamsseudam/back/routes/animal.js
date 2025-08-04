const express =  require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');  

const{Op, Sequelize} = require('sequelize');
const { Animal, User , Category, sequelize  } = require('../models');
const { isLoggedIn } = require('./middlewares');
const category = require('../models/category');
const animal = require('../models/animal');
const user = require('../models/user');

module.exports = router;

try {
  fs.accessSync('animalProfile');
}catch(error){
  fs.mkdirSync('animalProfile');
}

const upload = multer({
  storage: multer.diskStorage({ 
    destination(req, file, done) {  
      done(null,  'animalProfile'); 
    },
    filename(req, file, done) {  
      const ext      = path.extname(file.originalname);       
      const basename = 'ani_' + Date.now() + ext;
      done(null, basename);
    },
  }),
  limits : { fileSize: 20*1024*1024 }   // 10MB
});

router.post('/animalform', isLoggedIn, upload.single('aniProfile'), async (req, res, next) => {
  try{
    const animal = await Animal.create({
      aniName: req.body.aniName,
      aniAge: req.body.aniAge,
      aniProfile: req.file ? req.file.filename : null,
      UserId: req.user.id,
      CategoryId: req.body.categoryId,
    });
    res.status(201).json(animal);
  } catch(error){
    res.status(500).json({ message: '서버 에러 발생', error });
    next(error);
  }
});

router.get('/my', isLoggedIn, async (req, res, next) => {
  try {
    const myAnimals = await Animal.findAll({
      where: {UserId: req.user.id},
      order: [['createdAt', 'desc']],
    });
    if (!myAnimals || myAnimals.length === 0) {
      return res.status(404).json({ error: '동물 프로필을 찾을 수 없습니다.' });
    }
    res.status(200).json(myAnimals);
  } catch (error) {
    next(error);
  }
});

router.get('/user/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: '잘못된 사용자 ID입니다.' });
    }

    const animals = await Animal.findAll({
      where: { UserId: userId },
      order: [['createdAt', 'desc']],
    });

    res.status(200).json(animals);
  } catch (error) {
    next(error);
  }
});

router.get('/:animalId', async (req, res, next) => {
  try {
    const animal = await Animal.findOne({
      where: { id: req.params.animalId },
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
        {
          model: Animal,
          as: 'Followings',
          attributes: ['id'],
        },
        {
          model: Animal,
          as: 'Followers',
          attributes: ['id'],
        },
        {
          model: Category,
          attributes: ['content', 'id'],
        },
      ],
    });

    if (!animal) {
      return res.status(404).json({ error: '동물 프로필을 찾을 수 없습니다.' });
    }

    const userAnimals = await Animal.findAll({
      where: { UserId: animal.UserId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ animal, userAnimals });
  } catch (error) {
    next(error);
  }
});


//3. 프로필 삭제
router.delete('/:animalId', isLoggedIn, async (req, res, next) => {
  try { 
      const deleted = await Animal.destroy({   
        where: {
          id: req.params.animalId,    
          UserId : req.user.id 
        }
      }); 
      
       if (deleted === 0) {
         return res.status(403).json({ message: '권한이 없습니다.' });
       }
      
      res.status(200).json({ animalId: parseInt(req.params.animalId, 10), deleted });
    } catch (error) { 
      console.error(error);
      next(error);
    }
});

//4. 프로필 수정
router.patch('/:animalId', isLoggedIn, upload.single('aniProfile'), async (req, res, next) => {
  try {
    const updateData = {
        aniName: req.body.aniName,
        aniAge: req.body.aniAge,
        CategoryId: req.body.categoryId,
    };
    if (req.file) {
      updateData.aniProfile = req.file.filename;
    }

    const [updatedCount] = await Animal.update(updateData, {
      where: {
        id: req.params.animalId,
        UserId: req.user.id,
      },
    });
    if (updatedCount === 0) {
      return res.status(403).json({ message: '수정 권한이 없거나 존재하지 않는 프로필입니다.' });
    }
    res.status(200).json({
      message: '수정 완료',
      animal: {
        id: req.params.animalId,
        aniName: updateData.aniName,
        aniAge: updateData.aniAge,
        CategoryId: updateData.CategoryId,
        aniProfile: req.file?.filename, 
      },
    });
  }catch(error){
    next(error);
  }
})

router.patch('/:animalId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const targetAnimal = await Animal.findByPk(req.params.animalId);
    const followerAnimal = await Animal.findByPk(Number(req.body.myAnimalId)); 

    if (!targetAnimal || !followerAnimal) {
      return res.status(404).send('해당 동물 프로필을 찾을 수 없습니다.');
    }

    await targetAnimal.addFollower(followerAnimal); 
    res.status(200).json({ followedId: targetAnimal.id, followerId: followerAnimal.id });
  } catch (error) {
    next(error);
  }
});

router.delete('/:animalId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const targetAnimal = await Animal.findByPk(req.params.animalId);
    const followerAnimal = await Animal.findByPk(Number(req.body.myAnimalId)); 

    if (!targetAnimal || !followerAnimal) {
      return res.status(404).send('해당 동물 프로필을 찾을 수 없습니다.');
    }

    await targetAnimal.removeFollower(followerAnimal);
    res.status(200).json({ unfollowedId: targetAnimal.id, followerId: followerAnimal.id });
  } catch (error) {
    next(error);
  }
});

router.delete('/:animalId/follower', isLoggedIn, async (req, res, next) => {
  const { animalId } = req.params;    
  const { targetAnimalId } = req.body;
  await removeFollowerRelation(animalId, targetAnimalId);
  res.status(200).json({ removedFollowerId: targetAnimalId });
});

async function removeFollowerRelation(animalId, targetAnimalId) {
  const target = await Animal.findByPk(animalId);
  const follower = await Animal.findByPk(targetAnimalId);
  if (!target || !follower) throw new Error('Profile not found');
  await target.removeFollower(follower);
}

router.get('/:animalId/followers', async (req, res, next) => {
  try {
    const animal = await Animal.findByPk(req.params.animalId);
    const followers = await animal.getFollowers({
      include: [
        {model: Category, attributes: ['content','id'],},
        {model: Animal, as: 'Followings', attributes: ['id'],},
      ]
    });
    res.status(200).json(followers);
  } catch (error) {
    next(error);
  }
});

router.get('/:animalId/followings', async (req, res, next) => {
  try {
    const animal = await Animal.findByPk(req.params.animalId);
    const followings = await animal.getFollowings({
      include: [
        {model: Category, attributes: ['content','id'],},
        {model: Animal, as: 'Followers', attributes: ['id'],},
      ]
    });
    res.status(200).json(followings);
  } catch (error) {
    next(error);
  }
});

router.get('/:animalId/recommendations', async (req, res, next) => {
  try {
    const currentAnimal = await Animal.findByPk(req.params.animalId, {
      include: [{ model: Animal, as: 'Followings' },],
    });

    if (!currentAnimal) {
      return res.status(404).json({ message: '동물을 찾을 수 없습니다.' });
    }

    const followingIds = currentAnimal.Followings.map(a => a.id);

    const recommendedAnimals = await Animal.findAll({
      where: {
        id: {
          [Op.notIn]: [...followingIds, parseInt(req.params.animalId, 10)],
        },
      },
      limit: 5,
      order: [ [Sequelize.literal('RAND()')] ], 
      attributes: ['id', 'aniName', 'aniProfile'],
      include: [
        { model: Category, attributes: ['content','id'] }
      ], 
    });

    res.status(200).json(recommendedAnimals);
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  const { name = '', categoryId } = req.query;
  const where = {
    ...(name && { aniName: { [Op.like]: `%${name}%` } }),
    ...(categoryId && { CategoryId: Number(categoryId) }),
  };
  try {
    const animals = await Animal.findAll({
      where,
      include: [{ model: Category, attributes: ['id', 'content'] }],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: '검색 실패', error });
    next(error);
  }
});

module.exports = router;
