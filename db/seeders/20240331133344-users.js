/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        email: 'shuhermayer@gmail.com',
        password: '$2b$10$QcGCETo5sYrOiR1l7U8MZ.qHmS90SQDLCUmzmog91iZkn.DV05e..',
        role: 'admin',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'shuhermayer',
        is_org: false,
      },
      {
        email: 'alinaluzanova@gmail.com',
        password: '$2b$10$QcGCETo5sYrOiR1l7U8MZ.qHmS90SQDLCUmzmog91iZkn.DV05e..',
        role: 'admin',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'alinaluzanova',
        is_org: false,
      },
      {
        email: 'shcherba.elena@icloud.com',
        password: '$2b$10$QcGCETo5sYrOiR1l7U8MZ.qHmS90SQDLCUmzmog91iZkn.DV05e..',
        role: 'admin',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'shcherbaElena',
        is_org: false,
      },
      {
        email: 'rodiongolovinsky4@gmail.com',
        password: '$2b$10$QcGCETo5sYrOiR1l7U8MZ.qHmS90SQDLCUmzmog91iZkn.DV05e..',
        role: 'admin',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'rodiongolovinsky4',
        is_org: false,
      },
      {
        email: 'denchistyakov1@gmail.com',
        password: '$2b$10$QcGCETo5sYrOiR1l7U8MZ.qHmS90SQDLCUmzmog91iZkn.DV05e..',
        role: 'admin',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'denchistyakov1',
        is_org: false,
      },
      {
        email: 'ilya.tonkii@gmail.com',
        password: '$2b$10$QcGCETo5sYrOiR1l7U8MZ.qHmS90SQDLCUmzmog91iZkn.DV05e..',
        role: 'admin',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'ilyaTonkii',
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
    await queryInterface.bulkDelete('users', null, {})
  },
}
