const Sequelize = require('sequelize')
const { User, UserRank, Rank } = require('../../db/models')

const checkUserRank = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'score'],
    raw: true,
  })

  const userRank = await UserRank.findOne({
    where: { userId },
    attributes: ['userId', 'rankId', 'approved'],
  })

  const countedUserRank = await Rank.findOne({
    where: {
      scoreBorder: { [Sequelize.Op.lte]: user.score },
    },
    order: [['scoreBorder', 'DESC']],
  })

  let isRankChanged = false
  if (!userRank) {
    await UserRank.create({
      userId,
      rankId: countedUserRank.id,
      approved: false,
    })
  } else if (userRank.rankId !== countedUserRank.id) {
    isRankChanged = true
    await UserRank.update(
      {
        rankId: countedUserRank.id,
        approved: false,
      },
      {
        where: { userId },
      },
    )
  }
  const needApprove = isRankChanged || !userRank || !userRank?.approved
  console.log('isRankChanged', isRankChanged, userId)
  console.log('!userRank.approved', userRank?.approved)
  console.log('needApprove', needApprove)
  return { rank: countedUserRank.name, approved: !needApprove }
}

const viewNewRank = async (userId) => {
  await UserRank.update(
    {
      approved: true,
    },
    {
      where: { userId },
    },
  )
  return { approved: true }
}

module.exports = { checkUserRank, viewNewRank }
