const Sequelize = require('sequelize')
const WebSocket = require('ws')
const {
  Hackathon,
  Team,
  TeamAnswer,
  User,
  TeamUsers,
  UserOrganizationRating,
  UserOrganizations,
  HackathonsOrganizations,
} = require('../../db/models')
const { getWebSocketConnection } = require('./wsocket')
const { checkUserRank } = require('./checkUserRank')

const ratingCalculation = async (hackathonId) => {
  const hackathon = await Hackathon.findOne({
    where: { id: hackathonId },
    include: [
      {
        model: Team,
      },
    ],
  })
  const teamIds = hackathon.Teams.map((team) => team.id)
  const teamsAnswers = await TeamAnswer.findAll({
    where: { teamId: teamIds },
    attributes: ['teamId', 'score'],
    raw: true,
  })

  const teamsScores = teamsAnswers.reduce((acc, item) => {
    if (!acc[item.teamId]) {
      acc[item.teamId] = 0
    }
    acc[item.teamId] += item.score
    return acc
  }, {})

  const teamUsersArray = await TeamUsers.findAll({
    where: { teamId: teamIds },
    attributes: ['teamId', 'userId'],
    raw: true,
  })
  const teamUsers = teamUsersArray.reduce((acc, item) => {
    if (!acc[item.teamId]) {
      acc[item.teamId] = []
    }
    acc[item.teamId].push(item.userId)
    return acc
  }, {})

  // тут объекты с ключами - айди команды, значения - массив айдишников пользователей
  console.log('teamUsers', teamUsers)
  // тут объект с ключами - айди команды, значения - сумма баллов команды (за хакатон)
  console.log('teamsScores', teamsScores)

  // максимальный балл за хакатон, решил пока не придумывать новое поле,
  // если prize нужен не числовой - ок
  // в любом случае это поле еще нужно вставлять при создании хакатона
  const maxHackathonRating = +hackathon.prize

  const usersRating = Object.keys(teamUsers).reduce((acc, teamId) => {
    const teamScore = teamsScores[teamId] || 0
    const teamUsersCount = teamUsers[teamId].length
    const userRating = (maxHackathonRating * teamScore) / teamUsersCount
    teamUsers[teamId].forEach((userId) => {
      acc.push({ id: userId, rating: userRating })
    })
    return acc
  }, [])

  const hackathonOrganizations = await HackathonsOrganizations.findAll({
    where: { hackathonId },
    raw: true,
  })
  console.log('usersRating', usersRating)
  // распределённый по пользователям команды score (id - айди пользователя)
  // [
  //   { id: 1, rating: 5000 },
  //   { id: 3, rating: 5000 },
  //   { id: 2, rating: 10000 }
  // ]
  usersRating.forEach(async (user) => {
    await User.update(
      {
        score: Sequelize.literal(`score + ${user.rating}`),
      },
      {
        where: { id: user.id },
      },
    )
    const userOrgCurrentOrgId = await UserOrganizations.findOne({
      where: { userId: user.id },
    })

    if (userOrgCurrentOrgId && !!hackathonOrganizations.length) {
      const userOrgRating = await UserOrganizationRating.findOne({
        where: { userId: user.id, organizationId: userOrgCurrentOrgId.organizationId },
      })
      if (userOrgRating) {
        console.log('user.rating', user.rating)
        await UserOrganizationRating.update(
          {
            rating: Sequelize.literal(`rating + ${user.rating}`),
          },
          {
            where: { userId: user.id, organizationId: userOrgCurrentOrgId.organizationId },
          },
        )
      } else {
        await UserOrganizationRating.create({
          userId: user.id,
          organizationId: userOrgCurrentOrgId.organizationId,
          rating: user.rating,
        })
      }
      checkUserRank(user.id)
    }
  })

  const wsConnections = getWebSocketConnection()
  if (wsConnections) {
    wsConnections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            platform: 'Maybe you need to approve new rank',
            code: 'fetch_rank_status',
          }),
        )
      }
    })
  }
}

module.exports = ratingCalculation
