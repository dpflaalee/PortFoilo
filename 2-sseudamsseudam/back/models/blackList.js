module.exports = (sequelize, DataTypes) => {
  const Blacklist = sequelize.define('Blacklist', {
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  Blacklist.associate = (db) => {
    Blacklist.belongsTo(db.User, {
      as: 'Blocked',
      foreignKey: 'BlockedId',
    });

    Blacklist.belongsTo(db.User, {
      as: 'Blocking', 
      foreignKey: 'BlockingId',
    });
  };
  return Blacklist;
};
