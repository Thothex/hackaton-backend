const HackathonAPIRouter = require('express').Router()
const { Hackathon, Categories, HackathonsOrganizations, Organizations } = require('../../../db/models/index')

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
  console.log('id: ----------', id)
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

module.exports = HackathonAPIRouter
