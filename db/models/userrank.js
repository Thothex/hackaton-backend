const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserRank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Rank, { foreignKey: 'rankId', as: 'rank' })
    }
  }
  UserRank.init(
    {
      rankId: {
        type: DataTypes.INTEGER,
        field: 'rank_id',
      },
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
      approved: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'UserRank',
    },
  )
  return UserRank
}
