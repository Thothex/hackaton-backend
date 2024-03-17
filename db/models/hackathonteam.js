const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class HackathonTeam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HackathonTeam.init(
    {
      teamId: {
        type: DataTypes.INTEGER,
        field: 'team_id',
      },
      hackathonId: {
        type: DataTypes.INTEGER,
        field: 'hackathon_id',
      },
    },
    {
      sequelize,
      modelName: 'HackathonTeam',
      tableName: 'hackathon_teams',
    },
  )
  return HackathonTeam
}
