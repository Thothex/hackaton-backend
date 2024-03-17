const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class TeamAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TeamAnswer.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
      teamId: {
        type: DataTypes.INTEGER,
        field: 'team_id',
      },
      taskId: {
        type: DataTypes.INTEGER,
        field: 'task_id',
      },
      answer: DataTypes.STRING,
      score: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'TeamAnswer',
      tableName: 'team_answers',
    },
  )
  return TeamAnswer
}
