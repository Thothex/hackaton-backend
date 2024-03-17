const passport = require('passport')
const passportJWT = require('passport-jwt')
const jwt = require('jsonwebtoken')
const { default: getUserFromDatabase } = require('./getUser')
require('dotenv').config()

const { Strategy, ExtractJwt } = passportJWT

const { JWT_SECRET } = process.env

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}

const strategy = new Strategy(options, async (payload, done) => {
  console.log('getUserFromDatabase', getUserFromDatabase)
  // TODO: возможно логику проверки пользователя стоит перенести сюда
  // сейчас она находится в user.route.js
  const user = await getUserFromDatabase(payload.sub)
  if (user) {
    return done(null, user)
  }
  return done(null, false)
})

passport.use(strategy)

// тут можно добавить любые данные (в payload) чтобы они сохранились в jwt токене, но в целом зачем
// если мы вытаскиваем пользователя из базы
const generateToken = (user) => {
  const payload = {
    sub: user.id,
    user_id: user.id,
    email: user.email,
  }
  return jwt.sign(payload, JWT_SECRET)
}

module.exports = {
  passport,
  generateToken,
}
