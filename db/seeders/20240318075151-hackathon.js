/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
