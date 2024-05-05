const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Team, Task, Organizations, Achievement }) {
      User.belongsToMany(Team, {
        through: 'TeamUsers',
        foreignKey: 'user_id',
        otherKey: 'team_id',
        as: 'users',
      })
      User.belongsToMany(Task, { through: 'TeamAnswer', foreignKey: 'user_id', otherKey: 'task_id' })
      User.belongsToMany(Organizations, { through: 'UserOrganizations', foreignKey: 'userId', as: 'organizations' })
      User.belongsToMany(Achievement, {
        through: 'UserAchievements',
        foreignKey: 'user_id',
        otherKey: 'achievement_id',
      })
    }
  }

  User.init(
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      isOrg: {
        type: DataTypes.BOOLEAN,
        field: 'is_org',
      },
      role: DataTypes.INTEGER,
      status: DataTypes.STRING,
      avatar: DataTypes.TEXT,
      score: DataTypes.INTEGER,
      token:DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    },
  )
  return User
}
