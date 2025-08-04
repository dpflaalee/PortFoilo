const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const passportConfig = require('./passport');
const passport = require('passport');
const path = require('path'); //파일업로드 경로설정

const dotenv = require('dotenv'); //환경변수 로그
const morgan = require('morgan'); //요청상태 모니터

const user = require('./routes/user');
const post = require('./routes/post');
const posts = require('./routes/posts');
const hashtag = require('./routes/hashtag');
const complain = require('./routes/complain');
const admin = require('./routes/admin');
const search = require('./routes/search');
const notification = require('./routes/notification');
const groups = require('./routes/group');
const category = require('./routes/category');
const prize = require('./routes/prize');
const randomBox = require('./routes/randomBox');
const coupon = require('./routes/coupon');
const animal = require('./routes/animal');
const calendar = require('./routes/calendar');
const adminNoti = require('./routes/adminNoti');

//환경설정
dotenv.config();
const app = express();

//db연동
const db = require('./models');
const { isAdmin } = require('./routes/middlewares');

async function seedOpenScopes() {
  const count = await db.OpenScope.count();
  if (count === 0) {
    await db.OpenScope.bulkCreate([
      { id: 1, content: 'public', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, content: 'private', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, content: 'follower', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, content: 'group', createdAt: new Date(), updatedAt: new Date() },
    ]);
  }
  
  const CalendarDB = await db.Calendar.count();
    if (CalendarDB === 0) {
        await db.Calendar.bulkCreate([
        {
          id: 1,
          title: '대전 펫&캣쇼',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras suscipit augue ac tristique finibus. Suspendisse vitae gravida erat. Donec condimentum, lectus nec ultrices sodales, massa lectus viverra.',
          startDate: new Date('2025-05-09T10:00:00'),
          endDate: new Date('2025-05-11T18:00:00'),
          totaldays: 0,
          currentdays: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          title: '메가주 일산',
          content: '반려동물과 함께하는 특별한 축제, 2025 메가주 일산에 여러분을 초대합니다. 최신 반려용품, 건강·영양, 훈련·교육 등 다양한 브랜드와 이벤트가 한자리에! 반려동물과 함께 새로운 제품과 서비스를 직접 체험하며, 다가오는 5월 잊지 못할 소중한 추억을 만들어보세요!',
          startDate: new Date('2025-05-16T09:30:00'),
          endDate: new Date('2025-05-18T20:00:00'),
          totaldays: 0,
          currentdays: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          title: '궁디팡팡 캣페스타 양재',
          content: '고양이와 집사를 위한 축제 궁디팡팡 캣페스타',
          startDate: new Date('2025-05-30T10:00:00'),
          endDate: new Date('2025-06-01T17:30:00'),
          totaldays: 0,
          currentdays: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          title: '하루 만 보 걷기 챌린지',
          content: '반려동물과 매일 만 보 걷고 건강도 챙기자! 하루 만 보 걷기 챌린지, 지금 바로 시작하세요!',
          startDate: new Date('2025-06-01T00:00:00'),
          endDate: new Date('2025-06-08T00:00:00'),
          totaldays: 0,
          currentdays: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 5,
          title: '함께 아침 산책 챌린지',
          content: '매일 아침, 반려동물과 상쾌한 산책을 시작해보세요! 건강도 챙기고 하루를 활기차게 시작할 수 있어요.',
          startDate: new Date('2025-08-15T00:00:00'),
          endDate: new Date('2025-08-25T00:00:00'),
          totaldays: 0,
          currentdays: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 6,
          title: '셀카 한 장 챌린지',
          content: '매일 반려동물과 셀카 한 장씩 찍으며 추억을 쌓아보세요! 시간이 흐를수록 특별한 포토 다이어리가 완성됩니다.',
          startDate: new Date('2025-06-01T00:00:00'),
          endDate: new Date('2025-06-30T22:00:00'),
          totaldays: 0,
          currentdays: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 7,
          title: '고양이와 조용한 독서 시간 챌린지',
          content: '고양이와 함께 조용한 공간에서 책 읽기 20분! 함께하는 평화로운 시간이 정서적 안정에 좋아요.',
          startDate: new Date('2025-07-15T00:00:00'),
          endDate: new Date('2025-07-25T22:30:00'),
          totaldays: 0,
          currentdays: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 8,
          title: '건강 간식 만들기 챌린지',
          content: '우리 아이를 위한 건강한 수제 간식, 직접 만들어보는 건 어떨까요? 맛있고 안전한 간식으로 사랑을 표현해보세요.',
          startDate: new Date('2025-07-01T00:00:00'),
          endDate: new Date('2025-07-25T00:00:00'),
          totaldays: 0,
          currentdays: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 9,
          title: '반려동물 놀이 30분 챌린지',
          content: '하루 30분, 반려동물과 놀아주는 시간을 가져보세요! 즐거운 유대감이 깊어지고 스트레스도 날아가요.',
          startDate: new Date('2025-06-10T00:00:00'),
          endDate: new Date('2025-09-20T20:00:00'),
          totaldays: 0,
          currentdays: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ]);
      console.log('Calendars 기본 데이터 삽입 완료됨.');
    }
  }

db.sequelize
  .sync()
  .then(async () => {
    console.log('..........db');
    await seedOpenScopes();
  })
  .catch(console.error);

passportConfig();

//기타 연동
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // 쿠키 등 인증정보 포함 요청 허용
}));
app.use(express.json()); // 요청 본문파싱
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',  // 크로스 도메인 쿠키 허용 정도 조절
  }
}));
app.use(passport.initialize()); // 인증처리 라이브러리 초기화
app.use(passport.session()); //사용자 인증상태 저장

//TEST
app.get('/', (req, res)=>{res.send('Express Test');});
//app.use('/api', (req,res)=>{res.send('Link Test')});

app.use('/post', post);
app.use('/posts', posts);
app.use('/hashtag', hashtag);
app.use('/user', user);
app.use('/complain', complain);
app.use('/admin', admin);
app.use('/search', search);
app.use('/notification', notification);
app.use('/groups', groups);
app.use('/api/groups', groups);
app.use('/category', category);

app.use('/admin/prizes', prize);
app.use('/random-boxes', randomBox);
app.use('/api/random-box', coupon);
app.use('/animal', animal);
app.use('/uploads/animalProfile', express.static(path.join(__dirname, 'animalProfile')));
app.use('/calendar', calendar);
app.use('/adminNoti', adminNoti);
app.use('/userImages', express.static(path.join(__dirname, 'userImages')));
require('./jobs/giveRandomBoxJob');

app.listen(3065, () => { console.log('server...'); });
