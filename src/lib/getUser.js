const { User } = require('../../db/models')

const getUserFromDatabase = async (userId) => {
  try {
    const user = await User.findByPk(userId)
    return user
  } catch (error) {
    console.error('Error fetching user from database:', error)
    return null
  }
}

export default getUserFromDatabase
