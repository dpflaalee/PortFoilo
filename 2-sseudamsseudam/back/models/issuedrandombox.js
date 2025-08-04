'use strict';

module.exports = (sequelize, DataTypes) => {
  const IssuedRandomBox = sequelize.define('IssuedRandomBox', {
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    issuedReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  IssuedRandomBox.associate = (models) => {
    IssuedRandomBox.belongsTo(models.User, {
      foreignKey: 'UserId',
      onDelete: 'CASCADE',
    });
    IssuedRandomBox.belongsTo(models.Category, {
      foreignKey: 'CategoryId',
      onDelete: 'CASCADE',
      as: 'category',
    });
  };

  return IssuedRandomBox;
};
