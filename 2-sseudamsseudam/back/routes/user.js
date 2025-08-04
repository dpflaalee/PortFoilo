const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');
const { User, Post, Blacklist, UserProfileImage } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Transaction } = require('sequelize');
const multer = require('multer');  
const path = require('path');  
const fs = require('fs');  
const { sequelize } = require('../models');

try {
  fs.accessSync('userImages');  
} catch (error) {
  fs.mkdirSync('userImages'); 
}
/////////////////////////////////////////////////
//1. 업로드 설정
const upload = multer({
  storage: multer.diskStorage({ 
    destination(req, file, done) { 
      done(null, 'userImages'); 
    },
    filename(req, file, done) { 
      const ext = path.extname(file.originalname);      
      const basename = path.basename(file.originalname, ext); 
      done(null, basename + '_' + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }  
});

// 1. 회원가입
router.post('/', isNotLoggedIn, async (req, res, next) => {   
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 12);  
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashPassword,
      phonenumber: req.body.phoneNum,
    });
    const image = await UserProfileImage.create({
      src: ''
    })
    await user?.addUserProfileImage(image);
    res.status(201).send('회원가입완료!');
  } catch (error) {
    next(error);
  }
});

//2. 로그인
router.post('/login', isNotLoggedIn, async (req, res, next) => {
  const user = await User.findOne({where:{email:req.body.email}}) 
  const isMatch = await bcrypt.compare(req.body.password,user.password)
  if(!user||!isMatch){
    return res.status(401).json({isLogin:false, message:"아이디와 비밀번호를 확인해주세요!"})
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) {return next(err); }

    if (info) { return res.status(401).send(info.reason); }

    return req.login(user, async (loginErr) => {
      if (loginErr) {  return next(loginErr); }

      const fullUser = await User.findOne({  
        where: { id: user.id },    
        attributes: { exclude: ['password'] },  
        include: [{ model: Post, attributes: ['id'] }
          , { model: User, as: 'Followings', attributes: ['id'] }  
          , { model: User, as: 'Followers', attributes: ['id'] } 
          , { model: UserProfileImage, attributes: ['id'] }
        ],
      });
      return res.status(200).json(fullUser);
    });
  })(req, res, next);   
});


//3.  로그인한 경우 사용자의 정보가져오기
router.get('/', async (req, res, next) => {
  try {
    if (req.user) {
      const fullUser = await User.findOne({
        where: { id: req.user.id }, 
        attributes: { exclude: ['password'] },
        include: [
          { model: Post, attributes: ['id'] }
          , { model: User, as: 'Followings', attributes: ['id'] }
          , { model: User, as: 'Followers', attributes: ['id'] }
          , { model: User, as: 'Blocking', attributes: ['id'] }
          , { model: User, as: 'Blocked', attributes: ['id'] }
          , { model: UserProfileImage }
        ]
      });
      res.status(200).json(fullUser);
    } else {
      res.status(200).json(null); 
    }
  } catch (error) {
    next(error);
  }
});
router.post('/profileUpdate', isLoggedIn , upload.array('profileImage'), async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    await User.update({
      nickname: req.body.nickname,
    }, {
      where: { id: req.user.id },transaction:t
    });
    await UserProfileImage.update({
      src: req.body.profileImage,
    }, {
      where: { userId: req.user.id },transaction:t
    })
    await t.commit();
    res.status(201).json({ success: true });
  } catch (error) {
    await t.commit();
    next(error);
  }
});
router.post('/images', isLoggedIn, upload.array('profileImage'), (req, res, next) => { 
  res.json(  req.files.map(  (v)=> v.filename  ));
});

router.get('/postUser', async (req, res, next) => {
  try {
    const targetUserId = req.query.userId;
    const meId = req.user?.id;
    const isBlocked = await Blacklist.findOne({
      where: { BlockingId: targetUserId, BlockedId: meId },
    });

    //1) 로그인사용자확인
    if (req.user) {
      const fullUser = await User.findOne({
        where: { id: req.query.userId },
        attributes: { exclude: ['password'] },
        include: [
          { model: Post, attributes: ['id'] }
          , { model: User, as: 'Followings', attributes: ['id'] }
          , { model: User, as: 'Followers', attributes: ['id'] }
          , { model: User, as: 'Blocking', attributes: ['id'] } 
          , { model: User, as: 'Blocked', attributes: ['id'] }  
        ]
      });
      res.status(200).json({
        ...fullUser?.toJSON(),
        isBlockedMe: !!isBlocked,
      });
    } else {
      res.status(200).json(null); 
    }
  } catch (error) {
    next(error);
  }
});

//4. 로그아웃
router.post('/logout', isLoggedIn, (req, res, next) => {
  try {
    req.logout(function (err) {
      if (err) { return next(err); }

      req.session.destroy((err) => {  
        if (err) {
          return next(err);
        }
        res.send('ok'); 
      });
    });

  } catch (err) {

  }
});
//회원탈퇴
router.delete('/userDelete', isLoggedIn, async (req, res, next) => {
  try { });

    await User.destroy({
      where: { id: req.user.id },}]
    })
    await Post.destroy({
      where: { userId: req.user.id }
    })
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.session.destroy((err) => {
        if (err) {
          return next(err)
        }
        return res.send('ok');
      })
    })
  } catch (err) {
    next(err);
  }
});
//5. 닉네임변경
router.post('/nickname', isLoggedIn , upload.array('nickname'), async (req, res, next) => {
  try {
    await User.update({
      nickname: req.body.nickname,
    }, {
      where: { id: req.user.id }
    });
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
});
router.post('/changePass', isLoggedIn , async (req, res, next) => {
  const user = await User.findOne({
    where: {id : req.user.id}
  })
  const isMatch = await bcrypt.compare(req.body.changePass, user.password)
  if(isMatch){
    return res.status(401).json({success: false, message: '현재비밀번호와 다른 비밀번호를 입력해주세요.'})
  }
  const hashPassword = await bcrypt.hash(req.body.changePass, 12);
  try { 
    const result = await User.update({
      password: hashPassword,
    }, {
      where: { id: req.user.id }
    });
    res.status(200).json({success:true});
  } catch (error) {
    res.status(500).json({success:false});
    next(error);
  }
});
router.post('/userDelete', isLoggedIn, async (req, res, next) => {
  const user = await User.findOne({where: {id : req.user.id}})
  const isMatch = await bcrypt.compare(req.body.confirmPass,user.password);
  if(!isMatch){
    return res.status(401).json({message:'비밀번호를 확인해주세요!'})
  }
  try{
    await User.destroy({ where: { id: req.user.id } });
     req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.session.destroy((err) => {
        if (err) {
          return next(err)
        }
        return res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
      })
    })
  }catch(error){
    next(error)
  }
})
/////////////////////////////////////
//6. 팔로우
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) { res.status(403).send('유저를 확인해주세요'); }  

    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); 
  } catch (error) {
    next(error);
  }
});

//7. 팔로잉찾기 ( 내가 찾아보는 친구들 )
router.get('/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) { res.status(403).send('유저를 확인해주세요'); } 

    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (error) {
    next(error);
  }
});

//8. 팔로우찾기
router.get('/followers', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) { res.status(403).send('유저를 확인해주세요'); } 

    const followers = await user.getFollowers(); 
    res.status(200).json(followers);
  } catch (error) {
    next(error);
  }
});



//9. 언팔로우 
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) { res.status(403).send('유저를 확인해주세요'); }  

    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    next(error);
  }
});



//10. 나를 팔로워한사람 차단
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) { res.status(403).send('유저를 확인해주세요'); } 

    await user.removeFollowings(req.user.id); 
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    next(error);
  }
});
router.get('/myPage/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) { res.status(403).send('유저를 확인해주세요'); } 

    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    next(error);
  }
});

router.post('/sms/:phoneNum', async (req, res, next) => {
  try {

    const coolsms = require('coolsms-node-sdk').default;
    const messageService = new coolsms('', '');
    const random = Math.random() * 1000000;
    let num = Math.round(random);
    const addNum = Math.random() * 10;

    if (String(num).length < 6) {
      num = num + '' + Math.round(addNum)
    }


    const result = messageService.sendMany([
        {
          to: req.params.phoneNum,
          from: '01085434277',
          text: '인증번호 ' + '[' + num + ']'
        }, 
      },
      ])
    res.status(201).json(num);
  } catch (error) {
    next(error);
  }
})
var generateRandomNumber = function (min, max) {
  var randNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randNum;
}
const generateEmailVerificationToken = () => {
  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);
  return { token, expires }
}
router.post('/email/:userEmail', async (req, res, next) => {
  try {

    const result = generateEmailVerificationToken();
    const { userEmail } = req.params; 

    const mailOptions = {
      from: "during4277@naver.com",
      to: userEmail,
      subject: " 인증 관련 메일 입니다. ",
      html: `<p>링크를 클릭하면 비밀번호를 변경할 수 있습니다:</p>
        <p> <a href="http://localhost:3000/user/pwChange?userEmail=${userEmail}&token=${result.token}">Verify email</a></p>
        <p>This link will expire on ${result.expires}.</p>`
    }
    smtpTransport.sendMail(mailOptions, (err, response) => {
      if (err) {
        res.json({ ok: false, msg: ' 메일 전송에 실패하였습니다. ' })
        smtpTransport.close() 
        return
      } else {
        res.json({ ok: true, msg: ' 메일 전송에 성공하였습니다. ', authNum: number })
        smtpTransport.close() 
        return
      }
    })
    res.status(201).json('email success');
  } catch (error) {
    next(error);
  }
})

router.get('/block', isLoggedIn, async (req, res, next) => {
  try {
    const blocks = await Blacklist.findAll({
      where: { blockingId: req.user.id },
      include: [{ model: User, as: 'Blocked' }],
    });
    res.status(200).json(blocks.map(b => b.Blocked));
  } catch (err) {
    next(err);
  }
});

// 차단하기
router.patch('/:userId/block', isLoggedIn, async (req, res, next) => {
  try {
    const me = await User.findOne({
      where: { id: req.user.id },
      include: [
        { model: User, as: 'Followings', attributes: ['id'] },
        { model: User, as: 'Followers', attributes: ['id'] },
      ],
    });

    const target = await User.findOne({
      where: { id: req.params.userId },
      include: [
        { model: User, as: 'Followings', attributes: ['id'] },
        { model: User, as: 'Followers', attributes: ['id'] },
      ],
    });

    if (!me || !target) {
      return res.status(403).send('유저를 확인해주세요');
    }

    if (me.Followings.some(u => u.id === target.id)) {
      await me.removeFollowings(target);
    }

    if (me.Followers.some(u => u.id === target.id)) {
      await me.removeFollowers(target);
    }

    if (target.Followings.some(u => u.id === me.id)) {
      await target.removeFollowings(me);
    }

    if (target.Followers.some(u => u.id === me.id)) {
      await target.removeFollowers(me);
    }

    // 차단 등록
    await me.addBlocking(target);

    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    next(error);
  }
});

// 차단 삭제
router.delete('/:userId/block', isLoggedIn, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.user.id } });
    if (!me) {
      return res.status(403).send('유저를 확인해주세요');
    }

    await me.removeBlocking(req.params.userId);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    next(error);
  }
});
/////////////////////////////////////
module.exports = router;
