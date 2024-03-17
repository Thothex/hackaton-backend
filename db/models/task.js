const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Task.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      hackathonId: {
        type: DataTypes.INTEGER,
        field: 'hackathon_id',
      },
      maxScore: {
        type: DataTypes.INTEGER,
        field: 'max_score',
      },
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'tasks',
    },
  )
  return Task
}
