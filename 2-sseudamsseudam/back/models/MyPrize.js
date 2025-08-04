module.exports = (sequelize, DataTypes) => {
  const MyPrize = sequelize.define('MyPrize', {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    issuedReason: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dueAt: {
      type: DataTypes.DATE,
      allowNull: false 
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,  
      unique: true,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    //timestamps: false
  });

  // 관계 설정
  MyPrize.associate = (db) => {
    db.MyPrize.belongsTo(db.User, { foreignKey: 'UserId', as: 'user' });
    db.MyPrize.belongsTo(db.Prize, { foreignKey: 'PrizeId', as: 'prize' });
  };

  return MyPrize;
};
