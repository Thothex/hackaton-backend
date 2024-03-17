const bcrypt = require('bcrypt')
const express = require('express')
const { generateToken } = require('../../lib/auth')
const { User } = require('../../../db/models/index')

const LoginAPIRouter = express.Router()

LoginAPIRouter.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Wrong password123' })
  }
  try {
    const user = await User.findOne({ where: { email }, raw: true })
    if (!user) {
      return res.status(400).json({ error: 'Wrong password456' })
    }
    const isSame = await bcrypt.compare(password, user.password)
    if (isSame) {
      // раньше тут отдавался пользователь без пароля, теперь отдаем токен
      // можно дополнить ответ пользователем
      // const { password: userPass, ...userWithoutPassword } = user
      const token = generateToken(user)
      res.status(200)
      res.json({ token })
    }
  } catch (error) {
    console.error('error: ', error)
    res.status(500)
    res.json({ error: error.message })
  }
})

LoginAPIRouter.delete('/login', async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('error: ', err)
      return next(err)
    }
    res.clearCookie('user_sid')
    return res.json({ error: 'Session revoked' })
  })
})

module.exports = LoginAPIRouter
