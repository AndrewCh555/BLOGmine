/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'name', {
      type: Sequelize.STRING,
      default: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'name');
  },
};
