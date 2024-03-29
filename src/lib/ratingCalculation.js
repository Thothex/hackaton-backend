const Sequelize = require('sequelize')
const { Hackathon, Team, TeamAnswer, User, TeamUsers } = require('../../db/models')

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
  })
}

module.exports = ratingCalculation
