module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  });
  Group.associate = (db) => {
    db.Group.hasMany(db.Post);
    db.Group.belongsTo(db.OpenScope);
    db.Group.belongsToMany(db.Category, { through: 'GroupCategory'});
    db.Group.belongsToMany(db.User, { through: 'GroupMember', as: 'groupmembers' })
  }
  return Group;
};

