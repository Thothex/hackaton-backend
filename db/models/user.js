const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Team, Task, Organizations }) {
      User.belongsToMany(Team, { through: 'TeamUsers', foreignKey: 'user_id', otherKey: 'team_id' })
      User.belongsToMany(Task, { through: 'TeamAnswer', foreignKey: 'user_id', otherKey: 'task_id' })
      User.belongsToMany(Organizations, { through: 'UserOrganizations', foreignKey: 'userId', as: 'organizations' })
    }
  }

  User.init(
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    },
  )
  return User
}
