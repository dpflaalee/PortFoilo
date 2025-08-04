module.exports = (sequelize, DataTypes) =>{
  const UserProfileImage = sequelize.define('UserProfileImage',{
    src : {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  },{
    charset: 'utf8',
    collate: 'utf8_general_ci'
  })
  UserProfileImage.associate = (db) => {
    db.UserProfileImage.belongsTo(db.User);
  }
  return UserProfileImage;
}