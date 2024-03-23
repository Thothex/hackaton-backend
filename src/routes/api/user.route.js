import getUserByAdmin from '../../lib/getUserByAdmin'

const UserAPIRouter = require('express').Router()
const { User, Organizations, UserOrganizations } = require('../../../db/models')

UserAPIRouter.get('/user', (req, res) => {
  const { user } = req
  if (user) {
    const userWithoutPassword = { ...user.dataValues, password: undefined }
    res.send(userWithoutPassword)
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
})

UserAPIRouter.get('/users', async (req, res) => {
  const { user } = req
  if (user.role !== 'admin') res.status(403).json({ error: 'You are not allowed to do this action' })
  const users = await User.findAll({
    attributes: ['id', 'username', 'email', 'role'],
    include: [
      {
        model: Organizations,
        attributes: ['id', 'name'],
        through: {
          model: UserOrganizations,
          attributes: [],
        },
        as: 'organizations',
      },
    ],
  })
  res.status(200).json(users)
})

UserAPIRouter.put('/user/:id', async (req, res) => {
  const { id } = req.params
  const { user } = req
  const { organization } = req.body
  console.log('req.body', req.body)
  if (user.role !== 'admin') res.status(403).json({ error: 'You are not allowed to do this action' })
  const changingUser = await getUserByAdmin(id)

  if (organization) {
    const org = await UserOrganizations.findOne({
      where: {
        userId: id,
      },
    })
    if (org) {
      await org.update({
        organizationId: organization.id,
      })
    } else {
      console.log('org', org)
      console.log('organization.id', organization.id)
      await UserOrganizations.create({
        userId: id,
        organization_id: organization.id,
        // здесь долно быть organizationId: organization.id
      })
    }
  }
  const updatedUser = await getUserByAdmin(id)
  res.status(200).json(updatedUser)
})

export default UserAPIRouter
