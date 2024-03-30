const EditHackathonAPIRouter = require('express').Router()
const { Hackathon, Categories, Organizations, HackathonsOrganizations } = require('../../../db/models/index')
const ratingCalculation = require('../../lib/ratingCalculation')

EditHackathonAPIRouter.post('/hackathon', async (req, res) => {
  const { name, type, description, start, end, category, audience, rules, isPrivate, organizations } = req.body

  console.log('req.body: ', req.body)
  if (!name || !type || !description || !start || !end) {
    res.status(400)
    return res.json({ error: 'Some data not specified. name, type, description, start, end' })
  }

  // TODO: здесь надо будет сделать какую-то проверку на то,
  // что пользователь - представитель организации и имеет право создавать хакатон

  // if (req.user.role !== 'admin') {
  //   res.status(403)
  //   return res.json({ error: 'You are not allowed to do this action' })
  // }
  try {
    const newHackathon = await Hackathon.create({
      name,
      type,
      description,
      start,
      end,
      category_id: category.id,
      audience,
      organizer_id: req.user.id,
      rules,
      private: isPrivate || true,
    })

    const hackathonOrganizations = organizations.map((org) => ({
      hackathon_id: newHackathon.id,
      organization_id: org.id,
    }))

    console.log('hackathonOrganizations: ', hackathonOrganizations)

    await HackathonsOrganizations.bulkCreate(hackathonOrganizations)
    const createdHackathon = await Hackathon.findByPk(newHackathon.id, {
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

    const reducedHackathon = {
      ...createdHackathon.toJSON(),
      category: createdHackathon.category.name,
      category_id: undefined,
    }
    res.status(201)
    res.json(reducedHackathon)
  } catch (error) {
    console.error('error: ', error)
    res.status(500)
    res.json({ error: error.message })
  }
})

EditHackathonAPIRouter.put('/hackathon/:id', async (req, res) => {
  const hackathonId = req.params.id
  const {
    name,
    type,
    description,
    start,
    end,
    category,
    audience,
    rules,
    isPrivate,
    organizations,
    organizer_id,
    status,
  } = req.body
  if (req.user.id !== organizer_id) {
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
        type: type.name,
        description,
        start,
        end,
        category_id: category.id,
        audience: audience.name,
        organizer_id: req.user.id,
        rules,
        private: isPrivate || true,
        status,
      },
      {
        where: { id: Number(hackathonId) },
      },
    )

    const hackathonOrganizations = organizations.map((org) => ({
      hackathon_id: hackathon.id,
      organization_id: org.id,
    }))
    await HackathonsOrganizations.bulkCreate(hackathonOrganizations)
    console.log('hackathonOrganizations: ', hackathonOrganizations)

    const updatedHackathon = await Hackathon.findByPk(hackathonId, {
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

    if (status === 'Finished') {
      // TODO: функция подсчёта рейтинга
      console.log('Calculate rating.....................')
      ratingCalculation(hackathonId)
    }
    res.status(200)
    res.json(updatedHackathon)
  } catch (error) {
    console.log('error: ', error)
    res.status(500)
    res.json({ error: error.message })
  }
})

module.exports = EditHackathonAPIRouter
