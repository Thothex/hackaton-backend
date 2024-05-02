/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const organizations = [
      {
        name: 'MSU',
        description:'common desc',
        link:'https://www.deepl.com/translator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'ITMO',
        description:'common desc',
        link:'https://www.deepl.com/translator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'School №619 of SPB',
        link:'https://www.deepl.com/translator',
        description:'common desc',
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
    await queryInterface.bulkDelete('organizations', null, {});
  },
}
