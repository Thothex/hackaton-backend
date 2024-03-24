const {User} = require('../../../db/models')
import getUserByAdmin from '../../lib/getUserByAdmin'

const UserAPIRouter = require('express').Router()

const fileMiddleware = require('../../../middleware/file')

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
  try{
    const users = await User.findAll({
      attributes: ['email', 'username'],
      raw: true,
      where: { role: 'user' }
    });
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json({error: error.message})
  }
})

UserAPIRouter.put('/user/:id', fileMiddleware.single('avatar'), async (req, res) => {
  try {
    const { user } = req
    if (req.file) {
      const avatarFileName = req.file.filename
      await User.update({ avatar: avatarFileName }, { where: { id: user.id } })
      const userUpdate = await User.findOne({ where: { id: user.id } })
      res.status(200).json({ userUpdate })
    } else {
      res.status(401).json({ error: 'Error: No avatar file uploaded' })
    }
  } catch (error) {
    console.error('Error updating user data:', error)
    res.status(500).json({ error: 'Server error' })
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

UserAPIRouter.patch('/user/:id', async (req, res) => {
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

