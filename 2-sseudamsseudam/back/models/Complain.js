module.exports = (sequelize, DataTypes) => {
  const Complain = sequelize.define('Complain', {
    targetType: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    targetId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(255), 
      allowNull: true,
    },
    isBlind: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  Complain.associate = (db) => {
    Complain.belongsTo(db.User, {
      foreignKey: {
        name: 'ReporterId',
        allowNull: false,
      },
      as: 'Reporter',
    });
  };


  return Complain;
};
