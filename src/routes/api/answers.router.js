const UserAnswersAPIRouter = require('express').Router()
const fs = require('fs')
const path = require('path')
const WebSocket = require('ws')
const { Task, TeamAnswer, Hackathon } = require('../../../db/models')

const { default: setTeamAnswers } = require('../../lib/setTeamAnswers')
const { configure, getWebSocketConnection } = require('../../lib/wsocket')
const fileMiddleware = require('../../../middleware/file')

UserAnswersAPIRouter.route('/answers').get(async (req, res) => {
  // пока так:
  // по /answers получаем все хакатоны, где организатор наш юзер
  // если в query передаем id хакатона (?hackathonId=123), он отдает все ответы по этому хакатону
  // если передаем id хакатона и команды (?hackathonId=3&teamId=1), отдает ответы хакатона определенной команды
  try {
    const { user } = req
    const { hackathonId, teamId } = req.query

    if (!hackathonId) {
      const hackathons = await Hackathon.findAll({
        where: { organizer_id: user.id },
        raw: true,
      })
      return res.json({ hackathons })
    }
    const taskIds = await Task.findAll({
      where: { hackathon_id: +hackathonId },
      attributes: ['id'],
      raw: true,
    })
    const idsArray = taskIds.map((task) => task.id)

    if (teamId) {
      const answers = await TeamAnswer.findAll({
        where: {
          task_id: idsArray,
          team_id: +teamId,
        },
        attributes: ['id', 'answer', 'teamId', 'taskId', 'userId', 'score'],
        raw: true,
      })
      console.log('answers', answers)
      const parsedAnswers = answers.map((item) => ({
        ...item,
        answer: JSON.parse(item.answer),
      }))

      return res.json(parsedAnswers)
    }

    const answers = await TeamAnswer.findAll({
      where: { task_id: idsArray },
      raw: true,
    })
    return res.json({ answers })
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})

UserAnswersAPIRouter.post('/answers/:taskId/:taskType', fileMiddleware.single('file'), async (req, res) => {
  const { taskType } = req.params
  const { taskId, hackathonId, userAnswers, teamId } = req.body
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
    const basePath = `/answers/${String(hackathonId)}/${String(teamId)}/${String(taskId)}`
    console.log('=>>>>> basePath', path.sep)

    // if (!fs.existsSync(baseUrl)) {
    //   fs.mkdirSync(baseUrl, { recursive: true })
    // }
    // const fileData = req.file.buffer

    // TODO: !!!!!! путь должен быть таким, чтобы другой человек не перезатёр,
    // т.е.в урл должена быть директория
    // id хакатона, id задания, id пользователя

    // TODO: на светлое будущее вне бутбэкмпа: добавлять к файлу какой-нибудь хэш или таймштамп
    // чтобы нельзя было стырить чужой файл

    // TODO ссылку на файл записать в таблицу team_answers в поле answer
    // (переделать его на JSON тип,
    // записывать в свойство file/answers/text в зависимости от типа задания
    // (будет приходить с фронта))

    // fs.writeFile(`${baseUrl}/${fileName}`, fileData, (err) => {
    //   if (err) {
    //     console.error('Error writing file:', err)
    //     res.status(500).send('Error writing file.')
    //   } else {
    //     console.log('File uploaded successfully:', taskId)
    //     res.send('File uploaded successfully.')
    // //   }
    // })
    const fileUrlJSON = JSON.stringify({ fileUrl: `${basePath}/${fileName}` })
    console.log('fileUrlJSON', fileUrlJSON)
    const result = await setTeamAnswers({
      userAnswersJSON: fileUrlJSON,
      taskId,
      userId: req.user.id,
      teamId,
    })
    res.status(201).json({ ...result.dataValues, answer: JSON.parse(result.dataValues.answer) })
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
      teamId,
    })
    res.status(201).json({ ...result.dataValues, answer: JSON.parse(result.dataValues.answer) })
  }

  if (taskType === 'input') {
    // TODO см в файле функции setTeamAnswers
    const result = await setTeamAnswers({
      userAnswersJSON,
      taskId,
      userId: req.user.id,
      teamId,
    })

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

UserAnswersAPIRouter.route('/answers/score').post(async (req, res) => {
  try {
    const { user } = req
    const { answers } = req.body

    console.log('answers', req.body)
    // TODO: добавить проверку на организатора
    if (answers) {
      answers.forEach(async (answer) => {
        const { id, score } = answer
        await TeamAnswer.update({ score }, { where: { id } })
      })
      return res.status(201).json({ status: 'ok' })
    }
    return res.status(400).json({ status: 'error', message: 'No answers provided' })
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})

module.exports = UserAnswersAPIRouter
