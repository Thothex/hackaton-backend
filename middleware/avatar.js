const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { user } = req

    const basePath = path.join('public', 'avatars', String(user.id))

    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true })
    }

    cb(null, basePath)
  },
  filename: (req, file, cb) => {
    const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, fileName)
  },
})

module.exports = multer({ storage })
