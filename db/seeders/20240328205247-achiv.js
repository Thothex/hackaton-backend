'use strict';

/** @type {import('sequelize-cli').Migration} */
const {AchievementType, Rank} = require('../models');
module.exports = {
  async up (queryInterface, Sequelize) {
    const currentTime = new Date();

    async function getAllAchievementTypes() {
      try {
        const achievementTypes = await AchievementType.findAll({
          attributes: ['id', 'name', 'reason']
        });
        return achievementTypes;
      } catch (error) {
        console.error('Error fetching achievement types:', error);
        return null;
      }
    }

    async function getAllRanks() {
      try {
        const ranks = await Rank.findAll({
          attributes: ['id', 'name', 'scoreBorder']
        });
        return ranks;
      } catch (error) {
        console.error('Error fetching ranks:', error);
        return null;
      }
    }

    const [achievementTypes, ranks] = await Promise.all([getAllAchievementTypes(), getAllRanks()]);

    // Используем forEach для перебора массивов
    for (const achievementType of achievementTypes) {
      for (const rank of ranks) {
        await queryInterface.bulkInsert('achievements', [
          {
            name: `${achievementType.name} (${rank.name})`,
            icon: `${achievementType.name.toLowerCase().replace(/\s+/g, '_')}_${rank.name}_icon.svg`,
            reason: `For ${achievementType.reason.toLowerCase()} in ${rank.name} rank`,
            rank_id: rank.id,
            achievement_type_id: achievementType.id,
            createdAt: currentTime,
            updatedAt: currentTime
          }
        ], {});
      }
    }
  },


  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('achievements', null, {});
  }
};
