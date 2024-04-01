const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Organizations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {
        through: 'UserOrganizations',
        foreignKey: 'organization_id',
        otherKey: 'user_id',
        as: 'users',
      })
    }
  }
  Organizations.init(
    {
      name: DataTypes.STRING,
      // score: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Organizations',
      tableName: 'organizations',
    },
  )
  return Organizations
}
