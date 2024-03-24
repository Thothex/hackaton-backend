const OrganizationApiRouter = require('express').Router()
const { Organizations } = require('../../../db/models')

OrganizationApiRouter.route('/organizations').get(async (req, res) => {
  try {
    const organizations = await Organizations.findAll({ attributes: ['id', 'name'] })
    res.status(200).json(organizations)
  } catch (err) {
    res.status(500).json(err)
  }
})
module.exports = OrganizationApiRouter
