module.exports = (  sequelize , DataTypes   ) => { 
  const ChattingImage = sequelize.define('ChattingImage', {
    src: {
      type: DataTypes.STRING(255), 
      allowNull: false, 
    }, 
  }, {
    charset : 'utf8', 
    collate: 'utf8_general_ci',  
  });  
  
  ChattingImage.associate = (db) => { 
    db.ChattingImage.belongsTo(db.Chatting);
  }; 
  return ChattingImage;
};


