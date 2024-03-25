import getUserByAdmin from '../../lib/getUserByAdmin'

const UserAPIRouter = require('express').Router()

const avatarMiddleware = require('../../../middleware/avatar')

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

UserAPIRouter.put('/user/:id', avatarMiddleware.single('avatar'), async (req, res) => {
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
  try {
    const { user } = req
    let users
    if (user.role === 'admin') {
      users = await User.findAll({
        attributes: ['id', 'username', 'email', 'role', 'isOrg'],
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
    } else {
      users = await User.findAll({
        attributes: ['email', 'username'],
        raw: true,
        where: { role: 'user' },
      })
    }
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

UserAPIRouter.patch('/user/:id', async (req, res) => {
  const { id } = req.params
  const { user } = req
  const { organization, isOrg } = req.body
  console.log('req.body', req.body)
  if (user.role !== 'admin') res.status(403).json({ error: 'You are not allowed to do this action' })
  const changingUser = await getUserByAdmin(+id)

  try {
    await changingUser.update({
      isOrg,
    })

    if (organization) {
      const org = await UserOrganizations.findOne({
        where: {
          userId: +id,
        },
      })
      if (org) {
        await org.update({
          organizationId: organization.id,
        })
      } else {
        await UserOrganizations.create({
          userId: id,
          organization_id: organization.id,
          // здесь долно быть organizationId: organization.id
        })
      }
    }
  } catch (error) {
    console.error('Error updating user data:', error)
  }

  const updatedUser = await getUserByAdmin(id)
  res.status(200).json(updatedUser)
})

module.exports = UserAPIRouter
