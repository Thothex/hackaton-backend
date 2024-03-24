const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Team, Hackathon, TaskQuestoins }) {
      Task.belongsToMany(User, { through: 'TeamAnswer', foreignKey: 'task_id', otherKey: 'user_id' })
      Task.belongsToMany(Team, { through: 'TeamAnswer', foreignKey: 'task_id', otherKey: 'team_id' })
      Task.belongsTo(Hackathon, { foreignKey: 'hackathon_id', as: 'tasks' })
      Task.hasMany(TaskQuestoins, { foreignKey: 'task_id' })
    }
  }
  Task.init(
    {
      name: DataTypes.TEXT,
      description: DataTypes.TEXT,
      hackathonId: {
        type: DataTypes.INTEGER,
        field: 'hackathon_id',
      },
      maxScore: {
        type: DataTypes.INTEGER,
        field: 'max_score',
      },
      type: DataTypes.STRING,
      answers: DataTypes.JSON,
      answer: DataTypes.TEXT,
      wrong1: DataTypes.TEXT,
      wrong2: DataTypes.TEXT,
      wrong3: DataTypes.TEXT,
    },

    {
      sequelize,
      modelName: 'Task',
      tableName: 'tasks',
    },
  )
  return Task
}
