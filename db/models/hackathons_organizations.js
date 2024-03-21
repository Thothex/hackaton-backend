const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class HackathonsOrganizations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HackathonsOrganizations.init(
    {
      hackathonId: {
        type: DataTypes.INTEGER,
        field: 'hackathon_id',
      },
      organizationId: {
        type: DataTypes.INTEGER,
        field: 'organization_id',
      },
    },
    {
      sequelize,
      modelName: 'HackathonsOrganizations',
      tableName: 'hackathons_organizations',
    },
  )
  return HackathonsOrganizations
}
