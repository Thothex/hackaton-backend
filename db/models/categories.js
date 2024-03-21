const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    static associate({ Hackathon }) {
      this.belongsTo(Hackathon, { foreignKey: 'id' })
    }
  }
  Categories.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Categories',
      tableName: 'categories',
    },
  )
  return Categories
}
