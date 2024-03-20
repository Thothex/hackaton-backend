/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hackathons = [
      {
        name: 'Hackathon "Best Review"',
        type: 'team',
        description: 'Scientific digest! Participants will have the opportunity to act as real scientists',
        start: new Date(),
        category:'science',
        audience:'14 - 18 years,university',
        rules:'Time to solve the hackathon: 24 hours. The solution will need to be attached as a file',
        prize:'1000 hyperpoints',
        private: false,
        end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Rapid Dash through Articles and Journals',
        type: 'person',
        description: 'Your first scientific article in 24 hours!',
        category:'science',
        audience:'14 - 18 years,school',
        rules:'Time to solve the hackathon: 24 hours. The solution will need to be attached as a file',
        prize:'1000000 hyperpoints',
        private: false,
        start: new Date(),
        end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await queryInterface.bulkInsert('hackathons', hackathons, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('hackathons', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
