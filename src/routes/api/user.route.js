const UserAPIRouter = require('express').Router()

UserAPIRouter.get('/user', (req, res) => {
  const { user } = req
  if (user) {
    const userWithoutPassword = { ...user.dataValues, password: undefined }
    res.send(userWithoutPassword)
  } else {
    res.status(401).send({ eror: 'Unauthorized' })
  }
})

export default UserAPIRouter
