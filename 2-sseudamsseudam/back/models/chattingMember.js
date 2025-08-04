module.exports = (  sequelize , DataTypes   ) => { 
  const ChattingMember = sequelize.define('ChattingMember', {
    roleUser: { 
      type: DataTypes.STRING(45),
      allowNull: false, 
    }, 
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  }, {
    charset : 'utf8', 
    collate: 'utf8_general_ci',  
  });  
  return ChattingMember;
};
