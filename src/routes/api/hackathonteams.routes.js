const HachathonTeamsApiRouter = require('express').Router()
const { Team, HackathonTeam, TeamUsers, User, Hackathon } = require('../../../db/models')

HachathonTeamsApiRouter.get('/teams', async (req, res) => {
  console.log('req.params', req.query)
  const { hackathonId } = req.query
  try {
    const teams = await Team.findAll({
      include: [
        {
          model: Hackathon,
          where: { id: hackathonId },
        },
      ],
    })
    console.log('teams', teams)
    res.status(200).json(teams)
  } catch (err) {
    res.status(500).json({ message: 'Error creating team', error: err.message })
  }
})

module.exports = HachathonTeamsApiRouter
