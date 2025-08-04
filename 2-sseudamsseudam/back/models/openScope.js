module.exports = ( sequelize , DataTypes ) => {
  const OpenScope = sequelize.define('OpenScope',{
    content: {
      type : DataTypes.STRING(30),
      allowNull: false,}
  },{
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  });
  OpenScope.associate = (db) => {
    db.OpenScope.hasMany(db.Post);
    db.OpenScope.hasMany(db.Group);
  };
  return OpenScope;    
};