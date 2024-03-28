'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const currentTime = new Date();

    const achievementTypesData = [
      { name: 'Team Player', reason: 'active participation in team hackathons', createdAt: currentTime, updatedAt: currentTime }, // Командный игрок
      { name: 'Code Wizard', reason: 'participating in programming hackathons', createdAt: currentTime, updatedAt: currentTime }, // Кодовый волшебник
      { name: 'Walter White', reason: 'participation in scientific hackathons', createdAt: currentTime, updatedAt: currentTime }, // за научные хакатоны
      { name: 'Deadline Dynamo', reason: 'finishing the hackathon first', createdAt: currentTime, updatedAt: currentTime }, // Мастер времени
      { name: 'Domain Expert', reason: 'becoming an expert in exact filed', createdAt: currentTime, updatedAt: currentTime }, // Эксперт в области
      { name: 'Universal Hackathoner', reason: 'participating in various types of hackathons', createdAt: currentTime, updatedAt: currentTime }, // Универсальный Хакатонер
      { name: 'Trophy Conqueror', reason: 'many victories', createdAt: currentTime, updatedAt: currentTime }, // Трофейный Завоеватель
      { name: 'Hackathon Veteran', reason: 'being a veteran in hackathons', createdAt: currentTime, updatedAt: currentTime }, // Хакатонный Ветеран
      { name: 'Serial Champion', reason: 'victories in a row', createdAt: currentTime, updatedAt: currentTime }, // Серийный Победитель
      { name: 'Unrivaled Leader', reason: 'being an unrivaled leader', createdAt: currentTime, updatedAt: currentTime }, // Непревзойденный Лидер
      { name: 'Solo Champion', reason: 'being a solo champion', createdAt: currentTime, updatedAt: currentTime }, // Самостоятельный Чемпион
      { name: 'Persistent Participant', reason: 'attending all open hackathons in a row', createdAt: currentTime, updatedAt: currentTime }, // Постоянный Участник
    ];

    await queryInterface.bulkInsert('AchievementTypes', achievementTypesData, {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('AchievementTypes', null, {});
  }
};
