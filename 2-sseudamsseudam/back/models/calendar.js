module.exports = (sequelize, DataTypes) => {
  const Calendar = sequelize.define('Calendar', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totaldays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    currentdays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    timestamps: true,
    hooks: {
      beforeCreate: (calendar, options) => {
        const start = new Date(calendar.startDate);
        const end = new Date(calendar.endDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; 
        calendar.totaldays = diff;
      },
      beforeUpdate: (calendar, options) => {
        if (calendar.changed('startDate') || calendar.changed('endDate')) {
          const start = new Date(calendar.startDate);
          const end = new Date(calendar.endDate);
          const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          calendar.totaldays = diff;
        }
      }
    }
  });
  return Calendar;
};
