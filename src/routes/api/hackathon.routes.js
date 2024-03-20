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

HackathonAPIRouter.get('/hackathon/:id', async (req, res) => {
  const { id } = req.params;
  console.log('id: ----------', id)
  try {
    const hackathon = await Hackathon.findByPk(id);
    console.log(hackathon)
    if (!hackathon) {
      res.status(404).json({ error: "Hackathon not found" });
      return;
    }
    res.status(200).json(hackathon);
  } catch (error) {
    console.error('error: ', error)
    res.status(500).json({ error: error.message });
  }
})

module.exports = HackathonAPIRouter
