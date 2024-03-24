require('@babel/register')
const express = require('express')
// const session = require('express-session')
const { passport } = require('./src/lib/auth')

const serverConfig = require('./config/serverConfig')
// const sessionConfig = require('./config/sessionConfig')
const RegistrationAPIRouter = require('./src/routes/api/register.routes')
const LoginAPIRouter = require('./src/routes/api/login.routes')
const UserAPIRouter = require('./src/routes/api/user.route')
const HackathonAPIRouter = require('./src/routes/api/hackathon.routes')
const EditHackathonAPIRouter = require('./src/routes/api/edit.hackathon.routes')
const TaskApiRouter = require('./src/routes/api/task.routes')
const CategoryApiRouter = require('./src/routes/api/categories.router')
const OrganizationApiRouter = require('./src/routes/api/organizations.router')
const TeamApiRouter = require('./src/routes/api/team.routes')
const UserAnswersAPIRouter = require('./src/routes/api/answers.router')
const configureSockets = require('./src/lib/wsocket')
const { configure, getWebSocketConnection } = require('./src/lib/wsocket')

const app = express()
const PORT = 3000

app.use(passport.initialize())

serverConfig(app)

// api routes
app.use('/api', RegistrationAPIRouter)
app.use('/api', RegistrationAPIRouter)
app.use('/api', LoginAPIRouter)
app.use('/api', HackathonAPIRouter)
app.use('/api', CategoryApiRouter)
app.use('/api', OrganizationApiRouter)
app.use('/api', passport.authenticate('jwt', { session: false }), UserAPIRouter)
app.use('/api', passport.authenticate('jwt', { session: false }), EditHackathonAPIRouter)
app.use('/api', passport.authenticate('jwt', { session: false }), TaskApiRouter)
app.use('/api', passport.authenticate('jwt', { session: false }), TeamApiRouter)
app.use('/api', passport.authenticate('jwt', { session: false }), UserAnswersAPIRouter)

const server = app.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`)
  configure(server)
})
