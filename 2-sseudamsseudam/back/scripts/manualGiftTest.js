const { User, Animal, Prize, Category } = require('../models');

const userId = 1;  

const manualGiftTest = async (userId) => {
  try {

    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }


    // 유저가 소유한 동물 가져오기
    const animals = await Animal.findAll({
      where: { UserId: user.id },
      attributes: ['id', 'CategoryId']
    });

    if (!animals.length) {
      return null;
    }


    // 랜덤으로 동물 선택
    const selectedAnimal = animals[Math.floor(Math.random() * animals.length)];
    const categoryId = selectedAnimal.CategoryId;


    // 카테고리에 해당하는 랜덤박스 상품을 Prize 테이블에서 필터링
    const prizeItems = await Prize.findAll({
      where: { CategoryId: categoryId, type: 'randombox' }, // 필터링: 'randombox' 타입 상품
    });

    if (!prizeItems.length) {
      return null;
    }

    return {
      userId: user.id,
      categoryId,
      type: 'randombox',
    };
  } catch (error) {
    return null;
  }
};


