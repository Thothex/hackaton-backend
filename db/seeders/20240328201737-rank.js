'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const ranks = ['wooden', 'iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
    let previousScoreBorder = 0;
    for (let i = 0; i < ranks.length; i++) {
      const coefficient = (i)*100;

      const scoreBorder = previousScoreBorder + coefficient;

      await queryInterface.bulkInsert('Ranks', [
        { name: ranks[i], scoreBorder, createdAt: new Date(), updatedAt: new Date() }
      ], {});

      previousScoreBorder = scoreBorder;
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Ranks', null, {});
  }
};
