module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('IssuedRandomBoxes', 'issuedReason', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('IssuedRandomBoxes', 'issuedReason');
  }
};