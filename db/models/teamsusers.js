const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class TeamUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TeamUsers.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
        accepted:{
            type: DataTypes.BOOLEAN,
            field: 'accepted',
        },
      isCaptain: {
        type: DataTypes.BOOLEAN,
        field: 'is_captain',
      },
      teamId: {
        type: DataTypes.INTEGER,
        field: 'team_id',
      },
    },
    {
      sequelize,
      modelName: 'TeamUsers',
      tableName: 'team_users',
    },
  )
  return TeamUsers
}
