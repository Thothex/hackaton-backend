/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_questoins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.STRING,
      },
      text: {
        type: Sequelize.STRING,
      },
      task_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tasks',
          key: 'id',
        },
      },
      score: {
        type: Sequelize.STRING,
      },
      is_rightAnswer: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('taskQuestoins')
  },
}
