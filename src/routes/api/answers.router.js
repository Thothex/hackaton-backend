const UserAnswersAPIRouter = require('express').Router()
const WebSocket = require('ws')
const { Task, TeamAnswer, Hackathon, UserOrganizations, HackathonsOrganizations, Organizations, User} = require('../../../db/models')

const { default: setTeamAnswers } = require('../../lib/setTeamAnswers')
const { configure, getWebSocketConnection } = require('../../lib/wsocket')
const fileMiddleware = require('../../../middleware/file')
const { default: wsOnAnswer } = require('../../lib/wsOnAnswer')

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
  const { user } = req
  const { taskType } = req.params
  const { taskId, hackathonId, userAnswers, teamId } = req.body
  const userAnswersJSON = userAnswers ? JSON.stringify(userAnswers) : null

  const task = await Task.findOne({ where: { id: taskId }, raw: true })
  const hackaton = await Hackathon.findOne({ where: { id: task.hackathonId }, raw: true })

  if (hackaton.organizer_id === user.id) {
    return res.status(400).json({ message: 'The organizer cannot participate in their own hackathon' })
  }

  const userOrganization = await UserOrganizations.findOne({ where: { userId: user.id }, raw: true })
  const hackOrganizations = await HackathonsOrganizations.findAll({ where: { hackathonId: hackaton.id }, raw: true })
  if (hackOrganizations.length > 0) {
    const isEmployeeOrg = !!hackOrganizations.find((hack) => hack.organizationId === userOrganization?.organizationId)
    if (!isEmployeeOrg) {
      return res.status(400).json({ message: 'You are not an employee of this organization' })
    }
  }

  const today = new Date()
  const haStart = new Date(hackaton.start)
  const haEnd = new Date(hackaton.end)

  if (haStart > today || haEnd < today) {
    return res.status(400).json({ message: 'Невозможно сохранить ответ: хакатон еще не начался или уже закончился' })
  }
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

    // TODO: !!!!!! путь должен быть таким, чтобы другой человек не перезатёр,
    // т.е.в урл должена быть директория
    // id хакатона, id задания, id пользователя

    // TODO: на светлое будущее вне бутбэкмпа: добавлять к файлу какой-нибудь хэш или таймштамп
    // чтобы нельзя было стырить чужой файл

    // TODO ссылку на файл записать в таблицу team_answers в поле answer
    // (переделать его на JSON тип,
    // записывать в свойство file/answers/text в зависимости от типа задания
    // (будет приходить с фронта))

    const fileUrlJSON = JSON.stringify({ fileUrl: `${basePath}/${fileName}` })
    let pages = 0;
    const result = await setTeamAnswers({
      userAnswersJSON: fileUrlJSON,
      taskId,
      userId: req.user.id,
      teamId,
      pages,
    })
    const wsConnections = getWebSocketConnection();
    if (result) {
      setTimeout(() => {
        wsOnAnswer(wsConnections, WebSocket, +hackathonId);
        return res.status(201).json({ ...result.dataValues, answer: JSON.parse(result.dataValues.answer) });

      }, 6000);
    }
  }

  if (taskType === 'many-answers') {
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

    wsOnAnswer(wsConnections, WebSocket, hackathonId)
    return res.status(201).json({ ...result.dataValues, answer: JSON.parse(result.dataValues.answer) })
  }

  if (taskType === 'input') {
    const result = await setTeamAnswers({
      userAnswersJSON,
      taskId,
      userId: req.user.id,
      teamId,

    })
    wsOnAnswer(wsConnections, WebSocket, hackathonId)
    return res.status(201).json({ ...result.dataValues, answer: JSON.parse(result.dataValues.answer) })
  }
})

UserAnswersAPIRouter.route('/answers/score').post(async (req, res) => {
  try {
    const { answers, hackathonId } = req.body
    const ha = await Hackathon.findByPk(hackathonId);
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Organizations,
          as: 'organizations',
          through: {
            model: UserOrganizations,
            as: 'user_organizations',
            where: {
              organizationId: ha.organizer_id
            }
          }
        }
      ]
    });
    if (!user || (!user.organizations || !user.organizations.length) && !user.isOrg && user.role !== 'admin') {
      console.log("Access denied:", user);
      return res.status(403).json({ error: 'You are not allowed to perform this action' });
    }


    const isOrganizer = user.organizations.some(org => org.id === ha.organizer_id);
    if (!isOrganizer) {
      return res.status(403).json({ error: 'You are not allowed to perform this action' });
    }
    if (answers) {
      answers.forEach(async (answer) => {
        const { id, score } = answer
        await TeamAnswer.update({ score }, { where: { id } })
      })
      const wsConnections = getWebSocketConnection();
      console.log("WSCON", wsConnections)
      wsOnAnswer(wsConnections, WebSocket, +hackathonId)
      return res.status(201).json({ status: 'ok' })
    }
    return res.status(400).json({ status: 'error', message: 'No answers provided' })
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})

module.exports = UserAnswersAPIRouter
