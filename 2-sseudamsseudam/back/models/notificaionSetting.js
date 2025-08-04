module.exports = (sequelize, DataTypes) => {
    const NotificationSetting = sequelize.define('NotificationSetting', {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    NotificationSetting.associate = (db) => {
        db.NotificationSetting.belongsTo(db.User, {
            foreignKey: 'UserId',
            onDelete: 'CASCADE',
        });
    };

    return NotificationSetting;
};
