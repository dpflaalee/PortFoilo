module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        targetId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
    });

    Notification.associate = (db) => {
        Notification.belongsTo(db.User, { foreignKey: 'SenderId', as: 'Sender' });
        Notification.belongsTo(db.User, { foreignKey: 'ReceiverId', as: 'Receiver' });
    };
    return Notification;
};

