const HackathonAPIRouter = require('express').Router()
const { where } = require('sequelize')
const { Hackathon } = require('../../../db/models/index')

HackathonAPIRouter.get('/hackathon', async (req, res) => {
  try {
    const hackathons = await Hackathon.findAll()
    res.status(200)
    res.json(hackathons)
  } catch (error) {
    console.error('error: ', error)
    res.status(500)
    res.json({ error: error.message })
  }
})

module.exports = HackathonAPIRouter
