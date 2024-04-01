/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        id: 1,
        email: 'shuhermayer@gmail.com',
        password: '$2b$10$QcGCETo5sYrOiR1l7U8MZ.qHmS90SQDLCUmzmog91iZkn.DV05e..',
        role: 'admin',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'shuhermayer',
        is_org: true,
      },
    ]

    await queryInterface.bulkInsert('users', users, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  },
}
