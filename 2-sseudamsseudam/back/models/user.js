module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phonenumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deleteAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  User.associate = (db) => {
    db.User.hasMany(db.Notification, { foreignKey: 'SenderId', as: 'SentNotifications', });
    db.User.hasMany(db.Notification, { foreignKey: 'ReceiverId', as: 'ReceivedNotifications', });
    db.User.hasMany(db.NotificationSetting, {
      foreignKey: 'UserId',
      as: 'NotificationSettings',
      onDelete: 'CASCADE',
    });
    db.User.hasMany(db.UserProfileImage)
    db.User.hasMany(db.Complain, { foreignKey: 'ReporterId' });
    db.User.hasMany(db.Animal);
    db.User.hasMany(db.Post, {
      onDelete: 'CASCADE',
      hooks: true,
    });
    db.User.hasMany(db.Chatting);
    db.User.hasMany(db.Comment);

    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
    db.User.belongsToMany(db.Prize, { through: db.MyPrize, foreignKey: 'UserId' });
    db.User.belongsToMany(db.Group, { through: 'GroupMember', as: 'groupmembers', foreignKey: 'UserId' });
    db.User.belongsToMany(db.Place, { through: 'MyPlace', as: 'Places' });
    db.User.belongsToMany(db.ChattingRoom, { through: db.ChattingMember, foreignKey: 'UserId' });
    db.User.belongsToMany(db.User, {
      through: 'Blacklist',
      as: 'Blocking',   
      foreignKey: 'BlockingId',  
    });
    db.User.belongsToMany(db.User, {
      through: 'Blacklist',
      as: 'Blocked',      
      foreignKey: 'BlockedId',  
    });

  };
  return User;
};
