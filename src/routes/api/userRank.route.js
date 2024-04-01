const UserRankAPIRouter = require('express').Router()
const { checkUserRank, viewNewRank } = require('../../lib/checkUserRank')

UserRankAPIRouter.get('/user-rank/check', async (req, res) => {
  const { user } = req
  if (user) {
    const userRank = await checkUserRank(user.id)
    res.status(200).json({ ...userRank })
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
})

UserRankAPIRouter.get('/user-rank/approve', async (req, res) => {
  const { user } = req
  if (user) {
    await viewNewRank(user.id)
    const userRank = await checkUserRank(user.id)
    res.status(200).json(userRank)
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
})

module.exports = UserRankAPIRouter
