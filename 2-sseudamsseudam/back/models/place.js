module.exports = (sequelize, DataTypes) => {
  const Place = sequelize.define('Place', {
    lat: {
      type: DataTypes.FLOAT,
    },
    lng: {
      type: DataTypes.FLOAT,
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  Place.associate = (db) => {
    db.Place.belongsToMany(db.User, { through: 'MyPlace', as: 'Places' });
  };
  return Place;
};