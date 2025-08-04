module.exports = (sequelize, DataTypes) => {
  const GroupRequest = sequelize.define('GroupRequest', {
    GroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',  
        key: 'id'
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', 
        key: 'id'
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  });

  GroupRequest.associate = (db) => {
    db.GroupRequest.belongsTo(db.Group);
    db.GroupRequest.belongsTo(db.User); 
  };

  return GroupRequest;
};
