const multer = require('multer')
const path = require('path')
const fs = require('fs')

const answerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { hackathonId } = req.body
    const { teamId } = req.body
    const { taskId } = req.body

    const basePath = path.join('public', 'answers', String(hackathonId), String(teamId), String(taskId))
    console.log(basePath)

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

module.exports = multer({ storage: answerStorage })
