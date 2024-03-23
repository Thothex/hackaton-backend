const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Team, Task }) {
      User.belongsToMany(Team, { through: 'TeamUsers', foreignKey: 'user_id', otherKey: 'team_id' })
      User.belongsToMany(Task, { through: 'TeamAnswer', foreignKey: 'user_id', otherKey: 'task_id' })
    }
  }

  User.init(
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.INTEGER,
      status: DataTypes.STRING,
      avatar: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    },
  )
  return User
}
