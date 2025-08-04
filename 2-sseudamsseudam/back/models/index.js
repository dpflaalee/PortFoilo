const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {}; 

const sequelize = new Sequelize(config.database, config.username, config.password, config);

//모델정의
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Prize = require('./prize')(sequelize, Sequelize); 
db.Image = require('./image')(sequelize, Sequelize); 
db.Hashtag = require('./hashtag')(sequelize, Sequelize);  
db.Comment = require('./comment')(sequelize, Sequelize); 
db.Animal = require('./animal')(sequelize, Sequelize); 
db.Category = require('./category')(sequelize, Sequelize); 
db.OpenScope = require('./openScope')(sequelize, Sequelize); 
db.Place = require('./place')(sequelize, Sequelize); 
db.Group = require('./group')(sequelize, Sequelize); 
db.GroupMember = require('./groupmember')(sequelize, Sequelize);
db.GroupRequest = require('./groupRequest')(sequelize, Sequelize);
db.Complain = require('./complain')(sequelize, Sequelize); 
db.Notification = require('./notification')(sequelize, Sequelize); 
db.NotificationSetting = require('./notificaionSetting')(sequelize, Sequelize);
db.Calendar = require('./calendar')(sequelize, Sequelize);

db.Chatting = require('./chatting')(sequelize, Sequelize);
db.ChattingRoom = require('./chattingRoom')(sequelize, Sequelize);
db.ChattingImage = require('./chattingImage')(sequelize, Sequelize); 
db.ChattingMember = require('./chattingMember')(sequelize, Sequelize); 
db.Blacklist = require('./blackList')(sequelize, Sequelize);
db.MyPrize = require('./myPrize')(sequelize, Sequelize);  
db.IssuedRandomBox = require('./issuedrandombox')(sequelize, Sequelize);
db.UserProfileImage = require('./userProfileImage')(sequelize, Sequelize); 

//모델 관계설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) { 
    db[modelName].associate(db); 
  }
});

db.sequelize = sequelize; 
db.Sequelize = Sequelize;

module.exports = db;
