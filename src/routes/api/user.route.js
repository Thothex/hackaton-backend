const UserAPIRouter = require('express').Router()
const { User } = require('../../../db/models')
const fileMiddleware = require('../../../middleware/file')

UserAPIRouter.get('/user', (req, res) => {
  const { user } = req
  if (user) {
    const userWithoutPassword = { ...user.dataValues, password: undefined }
    res.send(userWithoutPassword)
  } else {
    res.status(401).json({ error: 'Unauthorized' })
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

module.exports = UserAPIRouter
