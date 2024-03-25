const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/avatars')
  },
  filename: (req, file, cb) => {
    const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, fileName)
  },
})

module.exports = multer({ storage })
