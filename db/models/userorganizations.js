const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserOrganizations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsTo(models.User, { foreignKey: 'userId' })
      // this.belongsTo(models.Organizations, { foreignKey: 'organizationId' })
    }
  }
  UserOrganizations.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
      organizationId: {
        type: DataTypes.INTEGER,
        field: 'organization_id',
      },
    },
    {
      sequelize,
      modelName: 'UserOrganizations',
      tableName: 'user_organizations',
    },
  )
  return UserOrganizations
}
