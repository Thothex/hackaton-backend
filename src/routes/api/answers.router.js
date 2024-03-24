const UserAnswersAPIRouter = require('express').Router()
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const WebSocket = require('ws')
const { Task } = require('../../../db/models')

const upload = multer()
const { default: setTeamAnswers } = require('../../lib/setTeamAnswers')
const { configure, getWebSocketConnection } = require('../../lib/wsocket')

UserAnswersAPIRouter.route('/answers?hakathonId=123').get(async (req, res) => {
  // должен отдавать по умолчанию ответы запрашивающего
  // по хакатону из квери параметров
})
UserAnswersAPIRouter.post('/answers/:taskId/:taskType', upload.single('file'), async (req, res) => {
  const { taskType } = req.params
  const { taskId, hackathonId, userAnswers } = req.body
  const userAnswersJSON = userAnswers ? JSON.stringify(userAnswers) : null

  /* ------------------------------------------ */
  //  Попытка отправить сообщение в websocket   //
  /* ------------------------------------------ */
  const wsConnections = getWebSocketConnection()
  // см вызов внизу перед res.send

  /* ------------------------------------------ */
  //    Конец логики отправки сообщений в ws    //
  /* ------------------------------------------ */

  if (taskType === 'document') {
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

    // TODO ссылку на файл записать в таблицу team_answers в поле answer
    // (переделать его на JSON тип,
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
    const fileUrlJSON = JSON.stringify({ fileUrl: `${baseUrl}/${fileName}` })
    setTeamAnswers({ userAnswersJSON: fileUrlJSON, taskId, userId: req.user.id })
  }
  if (taskType === 'many-answers') {
    // сравниваем ответы из userAnswers с правильными ответами из базы
    const task = await Task.findOne({ where: { id: taskId }, raw: true })
    const rightAnswers = Object.entries(task.answers).reduce((acc, [key, answer]) => {
      if (answer.isRight) {
        acc.push({ id: key, checked: true })
      }
      return acc
    }, [])
    const userAnswersArr = Object.entries(userAnswers).reduce((acc, [key, value]) => {
      if (value) {
        acc.push({ id: key, checked: true })
      }
      return acc
    }, [])

    let isRight
    if (rightAnswers.length === userAnswersArr.length) {
      isRight = rightAnswers.every((answer) => userAnswersArr.some((userAnswer) => userAnswer.id === answer.id))
    } else isRight = false
    const result = await setTeamAnswers({
      userAnswersJSON,
      taskId,
      userId: req.user.id,
      score: isRight ? task.maxScore : 0,
    })
    res.status(201).json({ ...result.dataValues, answer: JSON.parse(result.dataValues.answer) })
  }

  if (taskType === 'input') {
    // TODO см в файле функции setTeamAnswers
    const result = await setTeamAnswers({ userAnswersJSON, taskId, userId: req.user.id })

    if (wsConnections) {
      wsConnections.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              platform: 'Был получен ответ от команды, запросите обновление дашборда',
              hackathonId,
            }),
          )
        }
      })
    }
    res.status(201).json({ ...result.dataValues, answer: JSON.parse(result.dataValues.answer) })
  }
})
module.exports = UserAnswersAPIRouter
