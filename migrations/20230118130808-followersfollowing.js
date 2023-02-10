'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserFollowers', {
      userId: {
        type: Sequelize.UUID,
        references: {
          model: { tableName: 'users' },
          key: 'id',
          as: 'userId',
        },
      },
      followerId: {
        type: Sequelize.UUID,
        references: {
          model: { tableName: 'users' },
          key: 'id',
          as: 'followerId',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserFollowers');
  },
};
