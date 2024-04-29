/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hackathons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT,
      },
      type: {
        type: Sequelize.STRING,
      },
      category_id: {
        type: Sequelize.INTEGER,
      },
      audience: {
        type: Sequelize.STRING,
      },
      organizer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'organizations',
          key: 'id',
        },
      },
      rules: {
        type: Sequelize.TEXT,
      },
      prize: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.TEXT,
      },
      start: {
        type: Sequelize.DATE,
      },
      end: {
        type: Sequelize.DATE,
      },
      private: {
        type: Sequelize.BOOLEAN,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hackathons')
  },
}
