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
      order: [['start', 'ASC']],
    })
    const plainHackathons = hackathons.map((hackathon) => ({
      ...hackathon.toJSON(),
      // category: hackathon.category.name,
      category_id: undefined,
    }))
    res.status(200)
    res.json(plainHackathons)
  } catch (error) {
    console.error('error: ', error)
    res.status(500)
    res.json({ error: error.message })
  }
})

HackathonAPIRouter.get('/hackathon/:id', async (req, res) => {
  const { id } = req.params
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
    const plainHackathon = {
      ...hackathon.toJSON(),
      // category: hackathon.category.name,
      category_id: undefined,
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
    res.status(500).json({ message: 'Error creating team', error: err })
  }
})

module.exports = HackathonAPIRouter
