module.exports = (  sequelize , DataTypes   ) => { 
  const Chatting = sequelize.define('Chatting', {
    chatContent: {
      type: DataTypes.STRING(255), 
      allowNull: false, 
    }, 
    contentType: {
      type: DataTypes.STRING(45),
      allowNull: false, 
    }, 
  }, {
    charset : 'utf8', 
    collate: 'utf8_general_ci',   
  });  
  
  /// 관계설정
  Chatting.associate = (db) => { 
    db.Chatting.hasMany(db.ChattingImage);
    db.Chatting.belongsTo(db.User);
    db.Chatting.belongsTo(db.ChattingRoom);
  }; 
  return Chatting;
};
