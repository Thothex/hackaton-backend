const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }

  User.init(
    {
      email: DataTypes.STRING,
      login: DataTypes.STRING,
      password: DataTypes.STRING,
      team_id: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    },
  )
  return User
}
