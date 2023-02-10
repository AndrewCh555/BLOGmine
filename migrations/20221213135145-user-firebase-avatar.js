/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatarId');
    await queryInterface.createTable('avatars', {
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
        type: Sequelize.STRING,
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
    await queryInterface.addColumn('users', 'avatarId', {
      type: Sequelize.STRING,
      default: null,
    });
    await queryInterface.dropTable('avatars');
  },
};
