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

HackathonAPIRouter.post('/hackathon', async (req, res) => {
  const {
    name, type, description, start, end,
  } = req.body
  if (!name || !type || !description || !start || !end) {
    res.status(400)
    return res.json({ error: 'Some data not specified. name, type, description, start, end' })
  }

  if (req.user.role !== 'admin') {
    res.status(403)
    return res.json({ error: 'You are not allowed to do this action' })
  }
  try {
    const newHackathon = await Hackathon.create({
      name,
      type,
      description,
      start,
      end,
    })
    res.status(201)
    res.json(newHackathon)
  } catch (error) {
    console.error('error: ', error)
    res.status(500)
    res.json({ error: error.message })
  }
})

HackathonAPIRouter.put('/hackathon/:id', async (req, res) => {
  const hackathonId = req.params.id
  const {
    name, type, description, start, end,
  } = req.body
  if (req.user.role !== 'admin') {
    res.status(403)
    return res.json({ error: 'You are not allowed to do this action' })
  }
  try {
    const hackathon = await Hackathon.findByPk(hackathonId)
    if (!hackathon) {
      res.status(404)
      return res.json({ error: 'Hackathon not found' })
    }
    await Hackathon.update(
      {
        name,
        type,
        description,
        start,
        end,
      },
      {
        where: { id: hackathonId },
      },
    )
    const updatedHackathon = await Hackathon.findByPk(hackathonId)
    res.status(200)
    res.json(updatedHackathon)
  } catch (error) {
    console.log('error: ', error)
    res.status(500)
    res.json({ error: error.message })
  }
})

module.exports = HackathonAPIRouter
