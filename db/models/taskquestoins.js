const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class TaskQuestoins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Task, {
        foreignKey: 'taskId',
        as: 'task',
      })
    }
  }
  TaskQuestoins.init(
    {
      uuid: DataTypes.STRING,
      text: DataTypes.STRING,
      taskId: {
        type: DataTypes.INTEGER,
        field: 'task_id',
      },
      score: DataTypes.STRING,
      isRightAnswer: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'TaskQuestoins',
      tableName: 'task_questoins',
    },
  )
  return TaskQuestoins
}
