const { or } = require('sequelize')
const hackathon = require('../models/hackathon')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const links = [
      {
        hackathon_id: '1',
        organization_id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        hackathon_id: '1',
        organization_id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        hackathon_id: '2',
        organization_id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await queryInterface.bulkInsert('hackathons_organizations', links, {})
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
