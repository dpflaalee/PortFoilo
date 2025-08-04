const useRandomBox = async (myPrizeId) => {
  try {
    const myPrize = await MyPrize.findOne({
      where: { id: myPrizeId, usedAt: null },  
      include: [{ model: Prize, as: 'prize' }]
    });

    if (!myPrize) {      return;    }

    const prize = myPrize.prize;
    if (!prize || prize.type !== 'randombox') {      return;    }

    // 랜덤박스를 열어서 쿠폰 발급 여부 결정
    const chance = Math.random() * 100;
    let coupon = null;
    
    if (chance <= prize.probability) {
      coupon = await Coupon.create({
        UserId: myPrize.UserId,
        PrizeId: prize.id, 
        issuedReason: '랜덤박스 사용',
        dueAt: prize.dueAt,
      });
    } 
    
    // 랜덤박스를 사용 처리 (MyPrize에 기록)
    myPrize.usedAt = new Date();  
    await myPrize.save();

    return coupon; 
  } catch (error) {  }
};

// 예시 사용: MyPrize ID 1번 사용
useRandomBox(1);
