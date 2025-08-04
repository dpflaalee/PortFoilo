module.exports = (sequelize, DataTypes) => {
  const Animal = sequelize.define('Animal', {
    aniName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    aniAge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0 
      }
    },
    aniProfile: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  // 관계설정
  Animal.associate = (db) => {
    db.Animal.belongsTo(db.User);

    db.Animal.belongsToMany(db.Animal, {
      through: 'Friends',
      as: 'Followings',
      foreignKey: 'FollowerId',
      otherKey: 'FollowingId',
    });
    db.Animal.belongsToMany(db.Animal, {
      through: 'Friends',
      as: 'Followers',
      foreignKey: 'FollowingId',
      otherKey: 'FollowerId',
    });


    db.Animal.belongsTo(db.Category);
  };
  return Animal;
}
