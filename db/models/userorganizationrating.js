const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserOrganizationRating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserOrganizationRating.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
      organizationId: {
        type: DataTypes.INTEGER,
        field: 'organization_id',
      },
      rating: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'UserOrganizationRating',
      tableName: 'user_organization_ratings',
    },
  )
  return UserOrganizationRating
}
