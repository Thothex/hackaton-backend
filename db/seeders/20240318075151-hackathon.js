/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //   await queryInterface.createTable('hackathons', {
    //     id: {
    //       allowNull: false,
    //       autoIncrement: true,
    //       primaryKey: true,
    //       type: Sequelize.INTEGER,
    //     },
    //     name: {
    //       type: Sequelize.STRING,
    //     },
    //     type: {
    //       type: Sequelize.STRING,
    //     },
    //     description: {
    //       type: Sequelize.STRING,
    //     },
    //     start: {
    //       type: Sequelize.DATE,
    //     },
    //     end: {
    //       type: Sequelize.DATE,
    //     },
    //     createdAt: {
    //       allowNull: false,
    //       type: Sequelize.DATE,
    //     },
    //     updatedAt: {
    //       allowNull: false,
    //       type: Sequelize.DATE,
    //     },
    //   })
    // },

    const hackathons = [
      {
        name: 'Хакатон с типом "Командный" (team)',
        type: 'team',
        description: 'Hacktiv8 Hackathon is a hackathon event held by Hacktiv8.',
        start: new Date(),
        end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Хакатон с типом "Одиночный" (person)',
        type: 'person',
        description: 'Hacktiv8 Hackathon is a hackathon event held by Hacktiv8.',
        start: new Date(),
        end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await queryInterface.bulkInsert('hackathons', hackathons, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
