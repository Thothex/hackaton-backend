const HighscoreAPIRouter = require('express').Router()
const { User, TeamAnswer } = require('../../../db/models')

HighscoreAPIRouter.route('/highscore').get(async (req, res) => {
  try {
    const { user } = req

    const users = await User.findAll({
      attributes: ['id', 'username', 'score'],
      raw: true,
    })
    const highscore = users.sort((a, b) => b.score - a.score)
    return res.json({ highscore })
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})

module.exports = HighscoreAPIRouter
