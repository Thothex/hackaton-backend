const HighscoreAPIRouter = require('express').Router()
const { raw } = require('express')
const { User, UserOrganizationRating, UserOrganizations, Organizations } = require('../../../db/models')

HighscoreAPIRouter.route('/highscore').get(async (req, res) => {
  try {
    const { user } = req

    const users = await User.findAll({
      attributes: ['id', 'username', 'score'],
      raw: true,
    })
    const highscore = users.sort((a, b) => b.score - a.score)

    const organizations = await Organizations.findAll({ raw: true })
    console.log('organizations', organizations)
    const userOrganizationRatings = await UserOrganizationRating.findAll({
      attributes: ['organizationId', 'rating'],
      raw: true,
    })

    const organizationsHighscore = userOrganizationRatings.map((organization) => {
      const organizationName = organizations.find((org) => org.id === organization.organizationId).name
      return {
        id: organization.organizationId,
        organization: organizationName,
        rating: organization.rating,
      }
    })

    const sortedOrganizationsHighscore = organizationsHighscore.sort((a, b) => b.rating - a.rating)
    return res.json({ highscore, organizationsHighscore: sortedOrganizationsHighscore })
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})

module.exports = HighscoreAPIRouter
