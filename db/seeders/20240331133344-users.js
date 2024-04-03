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
      {
        id: 2,
        email: 'alinaluzanova@gmail.com',
        password: '$2b$10$QcGCETo5sYrOiR1l7U8MZ.qHmS90SQDLCUmzmog91iZkn.DV05e..',
        role: 'admin',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'alinaluzanova',
        is_org: true,
      },
      {
        id: 3,
        email: 'thothex@infochemistry.ru',
        password: '$2b$10$QcGCETo5sYrOiR1l7U8MZ.qHmS90SQDLCUmzmog91iZkn.DV05e..',
        role: 'user',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'thothex',
        is_org: false,
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
