const HackathonAPIRouter = require('express').Router()
const {
  Hackathon,
  Categories,
  HackathonsOrganizations,
  Organizations,
  Task,
  Team,
  HackathonTeam,
  TeamAnswer,
  sequelize,
  UserOrganizations,
  User
} = require('../../../db/models/index')

HackathonAPIRouter.get('/hackathon', async (req, res) => {
  try {
    const hackathons = await Hackathon.findAll({
      include: [
        {
          attributes: ['name'],
          model: Categories,
          as: 'category',
        },
        {
          model: Organizations,
          as: 'organizations',
          attributes: ['id', 'name'],
          through: {
            model: HackathonsOrganizations,
            attributes: [],
          },
        },
      ],
      order: [
        [sequelize.literal('CASE WHEN "end" < NOW() THEN 1 ELSE 0 END'), 'ASC'],
        ['start', 'ASC'],
      ],
    });

    const plainHackathons = await Promise.all(hackathons.map(async (hackathon) => {
      const organization = await Organizations.findByPk(hackathon.organizer_id);
      const userOrgs = await UserOrganizations.findAll({ where: { organizationId: organization.id } });
      const usersPromises = userOrgs.map(async (userOrg) => {
        return await User.findOne({ where: { id: userOrg.userId, isOrg: true }, raw: true });
      });
      const users = await Promise.all(usersPromises);

      return {
        ...hackathon.toJSON(),
        users: users,
        category_id: undefined,
      };
    }));

    res.status(200).json(plainHackathons);
  } catch (error) {
    console.error('error: ', error);
    res.status(500).json({ error: error.message });
  }
});



HackathonAPIRouter.get('/hackathon/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const hackathon = await Hackathon.findByPk(id, {
      include: [
        {
          attributes: ['id', 'name'],
          model: Categories,
          as: 'category',
        },
        {
          model: Organizations,
          as: 'organizations',
          attributes: ['id', 'name'],
          through: {
            model: HackathonsOrganizations,
            attributes: [],
          },
        },
        {
          model: Task,
          as: 'tasks',
        },
      ],
    })
    if (!hackathon) {
      res.status(404).json({ error: 'Hackathon not found' })
      return
    }
const organization = await Organizations.findByPk(hackathon.organizer_id)

      const plainHackathon = {
        ...hackathon.toJSON(),

        category_id: undefined,
        organizer_name: organization.name
      }
      res.status(200).json(plainHackathon)

  } catch (error) {
    console.error('error: ', error)
    res.status(500).json({ error: error.message })
  }
})

HackathonAPIRouter.get('/hackathon/:id/stat', async (req, res) => {
  const { id: hackathonId } = req.params
  try {
    const hackathon = await Hackathon.findOne({
      where: { id: hackathonId },
      include: [
        {
          model: Team,
          through: {
            model: HackathonTeam,
            attributes: ['teamId', 'hackathonId'],
          },
          attributes: ['id', 'name'],
        },
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'name', 'maxScore'],
        },
      ],
    })
    const taskIds = hackathon.tasks.map((task) => task.id)
    console.log('taskIds', taskIds)

    const teamsAnswers = await TeamAnswer.findAll({
      where: { taskId: taskIds },
      attributes: ['teamId', 'taskId', 'score', 'answer'],
      raw: true,
    })
    const teamsAnswersGrouped = teamsAnswers.map((item) => ({
      ...item,
      answer: JSON.parse(item.answer),
    }))
    const hackathonJSON = hackathon.toJSON()
    const teamsWithAnswers = {
      ...hackathonJSON,
      teams: hackathonJSON.Teams.map((team) => {
        const teamAnswers = teamsAnswersGrouped.filter((item) => item.teamId === team.id)
        return {
          ...team,
          answers: teamAnswers,
        }
      }),
      Teams: undefined,
    }
    res.status(200).json(teamsWithAnswers)
  } catch (err) {
    console.error('Error getting teams', err)
    res.status(500).json({ message: 'Stat error', error: err })
  }
})
HackathonAPIRouter.delete('/hackathon', async (req, res) => {
  const { id } = req.body;
  try {
    const hackathon = await Hackathon.findByPk(id);

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }
    await hackathon.destroy();
    return res.status(200).json({ message: "Hackathon deleted successfully" });
  } catch (error) {
    console.error("Error deleting hackathon:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = HackathonAPIRouter
