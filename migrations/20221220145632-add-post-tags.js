/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      default: [],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'tags');
  },
};
