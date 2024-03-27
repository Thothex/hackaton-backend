'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AchievementType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Achievement}) {
      AchievementType.hasMany(Achievement, {foreignKey:'achievement_type'})
    }
  }
  AchievementType.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AchievementType',
  });
  return AchievementType;
};
