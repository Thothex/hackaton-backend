/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const organizations = [
      {
        name: 'Leopards',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bears',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Молодцы-орлы',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await queryInterface.bulkInsert('organizations', organizations, {})
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
