const { User } = require('../../db/models')

const findUserInDatabase = async (username, password) => {
  try {
    const user = await User.findOne({ where: { username, password } })
    return user
  } catch (error) {
    console.error('Error finding user in database:', error)
    return null
  }
}

export default findUserInDatabase
