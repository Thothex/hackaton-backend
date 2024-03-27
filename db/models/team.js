const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Hackathon }) {
      Team.belongsToMany(User, {
        through: 'TeamUsers',
        foreignKey: 'team_id',
        otherKey: 'user_id',
        as: 'users',
      })
      Team.belongsToMany(Hackathon, { through: 'HackathonTeam', foreignKey: 'team_id', otherKey: 'hackathon_id' })
    }
  }
  Team.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Team',
      tableName: 'teams',
    },
  )
  return Team
}
