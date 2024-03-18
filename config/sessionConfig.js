const session = require('express-session')
require('dotenv').config()
const FileStore = require('session-file-store')(session)

const maxAge = 1000 * 60 * 60 * 12

const sessionConfig = {
  store: new FileStore(),
  name: 'user_sid',
  secret: process.env.SESSION_SECRET ?? 'test',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge,
  },
}

module.exports = sessionConfig
