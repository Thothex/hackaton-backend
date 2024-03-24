/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.TEXT,
      },
      hackathon_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'hackathons',
          key: 'id',
        },
      },
      max_score: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      answer: {
        type: Sequelize.TEXT,
      },
      answers: {
        type: Sequelize.JSON,
      },
      wrong1: {
        type: Sequelize.TEXT,
      },
      wrong2: {
        type: Sequelize.TEXT,
      },
      wrong3: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('tasks')
  },
}
