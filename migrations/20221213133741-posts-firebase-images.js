/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'images');
    await queryInterface.createTable('postImages', {
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
      postId: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'posts',
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
    await queryInterface.addColumn('posts', 'images', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
    });
    await queryInterface.dropTable('postImages');
  },
};
