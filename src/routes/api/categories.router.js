const CategoryApiRouter = require('express').Router()
const { Categories } = require('../../../db/models')

CategoryApiRouter.route('/categories').get(async (req, res) => {
  try {
    const categoies = await Categories.findAll({ attributes: ['id', 'name'] })
    res.status(200).json(categoies)
  } catch (err) {
    res.status(500).json(err)
  }
})
module.exports = CategoryApiRouter
