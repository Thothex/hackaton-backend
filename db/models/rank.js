'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Achievement}) {
      Rank.hasMany(Achievement, {foreignKey:'rank_id'})
    }
  }
  Rank.init({
    name: DataTypes.STRING,
    scoreBorder: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Rank',
  });
  return Rank;
};
