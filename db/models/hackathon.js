const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Hackathon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Hackathon.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      description: DataTypes.STRING,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Hackathon',
      tableName: 'hackathons',
    },
  )
  return Hackathon
}
