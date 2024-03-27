const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Achievement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Achievement.init(
    {
      name: DataTypes.STRING,
      icon: DataTypes.STRING,
      reason: DataTypes.STRING,
      rankId: {
        type: DataTypes.INTEGER,
        field: 'rank_id',
      },
      achievementTypeId: {
        type: DataTypes.INTEGER,
        field: 'achievement_type_id',
      },
    },
    {
      sequelize,
      modelName: 'Achievement',
      tableName: 'achievements',
    },
  )
  return Achievement
}
