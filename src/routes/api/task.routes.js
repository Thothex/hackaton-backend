const TaskApiRouter = require('express').Router()
const { Task, Hackathon } = require('../../../db/models')

TaskApiRouter.post('/hackathon/:hackathonId/task', async (req, res) => {
  console.log('req.body', req.body)
  const { hackathonId } = req.params
  const { name, description, maxScore, type, answers } = req.body
  const task = await Task.create({
    name,
    description,
    hackathon_id: hackathonId,
    maxScore: maxScore || 100,
    type,
    answers,
  })

  res.status(201)
  res.json({ id: task.id })
})

TaskApiRouter.put('/task/:taskId', async (req, res) => {
  const { taskId } = req.params
  const { id, name, description, maxScore, type, answers, hackathonId } = req.body
  try {
    const task = await Task.findByPk(id)
    console.log('task', task)
    task.update({
      name,
      description,
      hackathon_id: hackathonId,
      maxScore: +maxScore,
      type,
      answers,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }

  res.status(200).json({ id: taskId })
})

TaskApiRouter.route('/hackathon/:hackathonId/tasks')
  .get(async (req, res) => {
    try {
      const { hackathonId } = req.params
      const tasks = await Task.findAll({ where: { hackathonId }, raw: true })
      res.status(200).json(tasks)
    } catch (err) {
      res.status(500).json(err)
    }
  })

  .post(async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        res.status(403).json({ error: 'You are not allowed to do this action' })
        return
      }

      const { hackathonId } = req.params
      const hackathon = await Hackathon.findByPk(+hackathonId)
      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' })
      }

      const { name, description, maxScore, type, answer, wrong1, wrong2, wrong3 } = req.body
      const newTask = await Task.create({
        name,
        description,
        hackathon_id: hackathon.id,
        maxScore,
        type,
        answer,
        wrong1,
        wrong2,
        wrong3,
      })

      res.status(200).json(newTask)
    } catch (err) {
      res.status(500).json(err)
    }
  })

  .put(async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        res.status(403).json({ error: 'You are not allowed to do this action' })
        return
      }

      const { hackathonId, taskId } = req.params
      const hackathon = await Hackathon.findByPk(+hackathonId)
      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' })
      }

      const task = await Task.findOne({ where: { hackathon_id: hackathon.id, id: +taskId } })
      if (!task) {
        return res.status(404).json({ error: 'Task not found' })
      }

      const { name, description, maxScore, type, answer, wrong1, wrong2, wrong3 } = req.body

      await task.update({
        name,
        description,
        maxScore,
        type,
        answer,
        wrong1,
        wrong2,
        wrong3,
      })

      res.status(200).json(task)
    } catch (err) {
      res.status(500).json(err)
    }
  })

  .delete(async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        res.status(403).json({ error: 'You are not allowed to do this action' })
        return
      }

      const { hackathonId, taskId } = req.params
      const hackathon = await Hackathon.findByPk(+hackathonId)
      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' })
      }

      const task = await Task.findOne({ where: { hackathon_id: hackathon.id, id: +taskId } })
      if (!task) {
        return res.status(404).json({ error: 'Task not found' })
      }

      await task.destroy()

      res.status(200).end()
    } catch (err) {
      res.status(500).json(err)
    }
  })

module.exports = TaskApiRouter
