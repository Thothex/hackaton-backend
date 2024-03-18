const exoress = require('express')
const bcrypt = require('bcrypt')

const { User } = require('../../../db/models/index')

const RegistrationAPIRouter = exoress.Router()

RegistrationAPIRouter.post('/register', async (req, res) => {
  const { email, login, password } = req.body
  if (!email || !login || !password) {
    return res.status(400).json({ error: 'Login or password not specified' })
  }
  try {
    const user = await User.findOne({ where: { email } })
    if (user) {
      res.status(400).json({ error: 'You have already been registered' })
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10)
      const newUser = await User.create({ email, login, password: encryptedPassword })
      const { password: userPass, ...userWithoutPassword } = newUser.dataValues
      console.log('userWithoutPassword', userWithoutPassword)
      req.session.user = userWithoutPassword
      res.status(201)
      res.json({ email: userWithoutPassword.email, login: userWithoutPassword.login })
    }
  } catch (error) {
    console.error('ERROR: ', error)
    res.status(500)
    res.json({ error: error.message })
  }
})

module.exports = RegistrationAPIRouter
