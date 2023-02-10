/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('profilewallpapers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      imageName: {
        type: Sequelize.STRING,
      },
      mediaLink: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileId: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('profilewallpapers');
  },
};
