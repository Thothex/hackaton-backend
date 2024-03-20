require('@babel/register')
const express = require('express')
// const session = require('express-session')
const { passport } = require('./src/lib/auth')

const serverConfig = require('./config/serverConfig')
// const sessionConfig = require('./config/sessionConfig')
const RegistrationAPIRouter = require('./src/routes/api/register.routes')
const LoginAPIRouter = require('./src/routes/api/login.routes')
const { default: UserAPIRouter } = require('./src/routes/api/user.route')
const HackathonAPIRouter = require('./src/routes/api/hackathon.routes')
const EditHackathonAPIRouter = require('./src/routes/api/edit.hackathon.routes')
const TaskApiRouter = require('./src/routes/api/task.routes');
const app = express()
const PORT = 3000

app.use(passport.initialize())

serverConfig(app)

// api routes
app.use('/api', RegistrationAPIRouter)
app.use('/api', RegistrationAPIRouter)
app.use('/api', LoginAPIRouter)
app.use('/api', passport.authenticate('jwt', { session: false }), UserAPIRouter)
app.use('/api', passport.authenticate('jwt', { session: false }), EditHackathonAPIRouter)
app.use('/api', HackathonAPIRouter)
app.use('/api',passport.authenticate('jwt', { session: false }), TaskApiRouter)

app.listen(PORT, () => console.log(`Server is up on http://localhost:${PORT}`))
