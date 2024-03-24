import { where } from 'sequelize'

const { User, Organizations, UserOrganizations } = require('../../db/models')

const getUserByAdmin = async (id) => {
  const user = await User.findOne({
    where: {
      id,
    },
    attributes: ['id', 'username', 'email', 'role'],
    include: [
      {
        model: Organizations,
        attributes: ['id', 'name'],
        through: {
          model: UserOrganizations,
          attributes: [],
        },
        as: 'organizations',
      },
    ],
  })

  if (!user) {
    return null
  }
  return user
}

export default getUserByAdmin
