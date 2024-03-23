const UserAnswersAPIRouter = require('express').Router()
const fs = require('fs')
const multer = require('multer')

const upload = multer()
const path = require('path')

UserAnswersAPIRouter.route('/answers').get(async (req, res) => {
  // ...
})
UserAnswersAPIRouter.post('/answers/:taskId', upload.single('file'), async (req, res) => {
  // const { taskId } = req.params
  const { taskId, hackathonId } = req.body
  console.log('taskId', req.body.taskId)
  console.log('hackathonId', req.body.hackathonId)
  const fileName = req.file.originalname
  const baseUrl = path.join(__dirname, '..', '..', '..', 'uploads', 'answers', '123', '312', taskId)
  if (!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl, { recursive: true })
  }
  const fileData = req.file.buffer

  // TODO: !!!!!! путь должен быть таким, чтобы другой человек не перезатёр,
  // т.е.в урл должена быть директория
  // id хакатона, id задания, id пользователя

  // TODO: на светлое будущее вне бутбэкмпа: добавлять к файлу какой-нибудь хэш или таймштамп
  // чтобы нельзя было стырить чужой файл

  // TODO ссылку на файл записать в таблицу team_answers в поле answer (переделать его на JSON тип,
  // записывать в свойство file/answers/text в зависимости от типа задания
  // (будет приходить с фронта))

  fs.writeFile(`${baseUrl}/${fileName}`, fileData, (err) => {
    if (err) {
      console.error('Error writing file:', err)
      res.status(500).send('Error writing file.')
    } else {
      console.log('File uploaded successfully:', taskId)
      res.send('File uploaded successfully.')
    }
  })
})
module.exports = UserAnswersAPIRouter
