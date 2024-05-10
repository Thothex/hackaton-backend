const TeamApiRouter = require('express').Router()
const nodemailer = require('nodemailer')
const WebSocket = require('ws')
const { Op } = require('sequelize')
const {
  Team,
  HackathonTeam,
  TeamUsers,
  User,
  Hackathon,
  UserOrganizations,
  HackathonsOrganizations,
} = require('../../../db/models')
const { getWebSocketConnection } = require('../../lib/wsocket')

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
})

TeamApiRouter.post('/team', async (req, res) => {
  try {
    const { name, hackathonId } = req.body
    const { user } = req

    const hackathon = await Hackathon.findOne({ where: { id: hackathonId } })

    if (hackathon.organizer_id === user.id) {
      return res.status(400).json({ message: 'The organizer cannot participate in their own hackathon' })
    }

    const userOrganization = await UserOrganizations.findOne({ where: { userId: user.id }, raw: true })
    const hackOrganizations = await HackathonsOrganizations.findAll({ where: { hackathonId: hackathon.id }, raw: true })
    if (hackOrganizations.length > 0) {
      const isEmployeeOrg = !!hackOrganizations.find((hack) => hack.organizationId === userOrganization?.organizationId)
      if (!isEmployeeOrg) {
        return res.status(400).json({ message: 'You are not an employee of this organization' })
      }
    }

    // TODO: можно ли регистрировать на след хакатон команду с тем же именем?
    // с наименованием команд нужно разобраться
    // возможно стоит резервировать названия команд за пользователем и выбирать команду из списка
    // или по крайней мере давать создать новую команду, но с таким же названием

    const existingTeam = await Team.findOne({ where: { name } })
    if (existingTeam) {
      return res.status(400).json({ message: 'Team with this name already exists' })
    }

    const newTeam = await Team.create({ name })
    await HackathonTeam.create({ hackathon_id: hackathonId, team_id: newTeam.id })
    const users = await TeamUsers.create({
      team_id: newTeam.id,
      user_id: user.id,
      isCaptain: true,
      accepted: true,
    })
    res.status(201).json(newTeam)
  } catch (err) {
    res.status(500).json({ message: 'Error creating team', error: err.message })
  }
})

TeamApiRouter.get('/team/:hackathonId/:userId', async (req, res) => {
  try {
    const { hackathonId, userId } = req.params

    const hackathonTeams = await HackathonTeam.findAll({
      where: { hackathon_id: hackathonId },
      raw: true,
      attributes: ['team_id'],
    })
    const teamIds = hackathonTeams.map((hackathonTeam) => hackathonTeam.team_id)

    const teamUser = await TeamUsers.findOne({
      where: {
        teamId: {
          [Op.in]: teamIds,
        },
        userId: +userId,
      },
    })
    console.log('teamIdsAAAAAA', teamIds)
    console.log('teamUserAAAAA', teamUser)

    if (!teamUser) {
      return res.status(404).json({ message: 'User is not a member of any team for this hackathon' })
    }

    const teamId = teamUser.team_id
    const team = await Team.findOne({ where: { id: teamId }, raw: true })

    const usersTeam = await TeamUsers.findAll({ where: { teamId } })

    const userIds = usersTeam.map((userTeam) => userTeam.user_id)

    const foundUsers = await User.findAll({
      where: { id: userIds },
      raw: true,
      attributes: ['id', 'email', 'username', 'avatar'],
    })

    const usersWithTeamInfo = foundUsers.map((user) => {
      const teamInfo = usersTeam.find((userTeam) => userTeam.user_id === user.id)
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        isCaptain: teamInfo.isCaptain,
        accepted: teamInfo.accepted,
        avatar: user.avatar,
      }
    })

    res.status(200).json({ team, teamUsers: usersWithTeamInfo })
  } catch (err) {
    // В случае ошибки вернуть соответствующий статус и сообщение об ошибке
    res.status(500).json({ message: 'Error getting team members', error: err.message })
  }
})

TeamApiRouter.post('/team/invite', async (req, res) => {
  try {
    const { teamId, member, hackathonId } = req.body

    const team = await Team.findByPk(teamId)
    console.log(team, '------------------TEAM')
    if (!team) {
      return res.status(404).json({ message: 'Team not found' })
    }

    const user = await User.findOne({ where: { email: member } })
    console.log(user, '------------------USER')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const existingTeamUser = await TeamUsers.findOne({ where: { team_id: teamId, user_id: user.id } })
    if (existingTeamUser) {
      return res.status(400).json({ message: 'User already in the team' })
    }

    const hackathon = await Hackathon.findByPk(hackathonId)
    await transporter.sendMail({
      from: `${process.env.MAIL_ACCOUNT}`,
      to: member,
      subject: 'Invitation to join a team in a hackathon',
      html: `
                <h3>User ${req.user.email} invited you to join the team ${team.name} in hackathon <strong style="color:'#7d98e2'">${hackathon.name}</strong>.</h3>
                <p>You can accept the invitation by clicking on the link below:</p> 
                <a href="${process.env.CLIENT_URL}/team/accept/${teamId}/${user.id}">Accept Invitation</a>
            `,
    })
    await TeamUsers.create({
      team_id: teamId,
      user_id: user.id,
      isCaptain: false,
      accepted: false,
    })
    res.status(201).json({ message: 'User was invited' })
  } catch (err) {
    res.status(500).json({ message: 'Error inviting user to team', error: err.message })
  }
})

TeamApiRouter.get('/team/accept/:teamId/:userId', async (req, res) => {
  try {
    const { teamId, userId } = req.params

    const team = await Team.findByPk(teamId)
    if (!team) {
      return res.status(404).json({ message: 'Team not found' })
    }

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const existingTeamUser = await TeamUsers.findOne({ where: { team_id: teamId, user_id: user.id } })
    if (!existingTeamUser) {
      return res.status(400).json({ message: 'User is not a member of the team' })
    }

    await TeamUsers.update({ accepted: true }, { where: { team_id: teamId, user_id: user.id } })
    const wsConnections = getWebSocketConnection()
    if (wsConnections) {
      wsConnections.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              teamId,
              text: `User ${user.email} has accepted the invitation to join the team ${team.name}`,
            }),
          )
        }
      })
    }
    res.status(200).json({ message: 'User was added to the team' })
  } catch (err) {
    res.status(500).json({ message: 'Error adding user to team', error: err.message })
  }
})

module.exports = TeamApiRouter
