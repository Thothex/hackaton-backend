const { Model } = require('sequelize')
const organizations = require('./organizations')

module.exports = (sequelize, DataTypes) => {
  class Hackathon extends Model {
    static associate({ Task, Team, User, Categories, Organizations, HackathonsOrganizations }) {
      Hackathon.hasMany(Task, { foreignKey: 'hackathon_id' })
      Hackathon.belongsToMany(Team, { through: 'HackathonTeam', foreignKey: 'hackathon_id', otherKey: 'team_id' })
      Hackathon.belongsTo(User, { foreignKey: 'organizer_id' })
      Hackathon.belongsTo(Categories, { foreignKey: 'category_id', as: 'category' })
      Hackathon.belongsToMany(Organizations, {
        through: 'HackathonsOrganizations',
        foreignKey: 'hackathon_id',
        otherKey: 'organization_id',
        as: 'organizations',
      })
    }
  }
  Hackathon.init(
    {
      name: DataTypes.TEXT,
      type: DataTypes.STRING,
      audience: DataTypes.STRING,
      organizer_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      rules: DataTypes.TEXT,
      prize: DataTypes.TEXT,
      description: DataTypes.TEXT,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      private: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Hackathon',
      tableName: 'hackathons',
    },
  )
  return Hackathon
}
