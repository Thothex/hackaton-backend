const {User} = require('../../../db/models')

const UserAPIRouter = require('express').Router()

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
    console.log(users)
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json({error: error.message})
  }
})

export default UserAPIRouter
