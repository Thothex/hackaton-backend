const express = require('express')
const bcrypt = require('bcrypt')

const { User } = require('../../../db/models/index')

const RegistrationAPIRouter = express.Router()

RegistrationAPIRouter.post('/register', async (req, res) => {
  const { email, username, password } = req.body
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'username or password not specified' })
  }
  try {
    const user = await User.findOne({ where: { email } })
    if (user) {
      res.status(400).json({ error: 'You have already been registered' })
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        email,
        username,
        password: encryptedPassword,
        role: 'user',
      })
      const { password: userPass, ...userWithoutPassword } = newUser.dataValues
      console.log('userWithoutPassword', userWithoutPassword)
      res.status(201)
      res.json({ email: userWithoutPassword.email, username: userWithoutPassword.username })
    }
  } catch (error) {
    console.error('ERROR: ', error)
    res.status(500)
    res.json({ error: error.message })
  }
})

module.exports = RegistrationAPIRouter
