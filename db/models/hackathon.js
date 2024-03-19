const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Hackathon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Task, Team, User }) {
      Hackathon.hasMany(Task, { foreignKey: 'hackathon_id' })
      Hackathon.belongsToMany(Team, { through: 'HackathonTeam', foreignKey: 'hackathon_id', otherKey: 'team_id' })
      Hackathon.belongsTo(User, { foreignKey: 'organizer_id' })
    }
  }
  Hackathon.init(
    {
      name: DataTypes.TEXT,
      type: DataTypes.STRING,
      category: DataTypes.STRING,
      audience: DataTypes.STRING,
      organizer_id: DataTypes.INTEGER,
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
