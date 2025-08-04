module.exports = (sequelize, DataTypes) => {
  const Prize = sequelize.define('Prize', {
    content: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    probability: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    dueAt: {
      type: DataTypes.DATE, 
      allowNull: false
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true, 
  });

  // 관계 설정
  Prize.associate = (db) => {
    db.Prize.belongsTo(db.Category, {
      foreignKey: 'CategoryId',
      as: 'category'
    });

    db.Prize.belongsToMany(db.User, {
      through: db.MyPrize,
      foreignKey: 'PrizeId',
      as: 'users'
    });
  };

  return Prize;
};
