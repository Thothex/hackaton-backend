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
        name: 'Хакатон "Лучшая рецензия"',
        type: 'team',
        description: 'Научный дайджест! Участникам будет предложено побыть в роли настоящего ученого',
        start: new Date(),
        category:'наука',
        audience:'school students',
        rules:'Время на решение хакатона: 24 часа. Решение необходимо будет прикрепить в виде файла',
        prize:'1000 гиперочков',
        private: false,
        end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Галопом по статьям и журналам',
        type: 'person',
        description: 'Твоя первая научная статья за 24 часа!',
        category:'наука',
        audience:'school students',
        rules:'Время на решение хакатона: 24 часа. Решение необходимо будет прикрепить в виде файла',
        prize:'1000000 гиперочков',
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
