module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define('GroupMember', {
    GroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isLeader: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  GroupMember.associate = (db) => {
    db.GroupMember.belongsTo(db.Group);
    db.GroupMember.belongsTo(db.User);
  };
  return GroupMember;
};
