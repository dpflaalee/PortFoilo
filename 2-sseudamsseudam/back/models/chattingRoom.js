module.exports = (  sequelize , DataTypes   ) => { 
  const ChattingRoom = sequelize.define('ChattingRoom', {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false, 
    }, 
  }, {
    charset : 'utf8', 
    collate: 'utf8_general_ci', 
  });  

  ChattingRoom.associate = (db) => { 
    db.ChattingRoom.belongsToMany(db.User, { through: db.ChattingMember ,foreignKey:'ChattingRoomId'});
    db.ChattingRoom.hasMany(db.Chatting);
  }; 
  return ChattingRoom;
};
