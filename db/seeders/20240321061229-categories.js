/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        name: 'Chemistry',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Biology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Development',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Algorithms',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Data Science',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Art',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Philosophy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await queryInterface.bulkInsert('categories', categories, {})
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
