const { Task, Hackathon } = require('../../../db/models');
const TaskApiRouter = require('express').Router();

TaskApiRouter.route('/hackathon/:hackathonId/tasks')
    .get(async (req, res) => {
        try {
            const { hackathonId } = req.params;
            const tasks = await Task.findAll({where:{hackathonId}, raw:true});
            res.status(200).json(tasks);
        } catch (err) {
            res.status(500).json(err);
        }
    })

    .post(async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                res.status(403).json({ error: 'You are not allowed to do this action' });
                return;
            }

            const { hackathonId } = req.params;
            const hackathon = await Hackathon.findByPk(+hackathonId);
            if (!hackathon) {
                return res.status(404).json({ error: 'Hackathon not found' });
            }

            const { name, description, max_score, type, answer, wrong1, wrong2, wrong3 } = req.body;
            const newTask = await Task.create({
                name,
                description,
                hackathon_id: hackathon.id,
                max_score,
                type,
                answer,
                wrong1,
                wrong2,
                wrong3
            });

            res.status(200).json(newTask);
        } catch (err) {
            res.status(500).json(err);
        }
    })

    .put(async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                res.status(403).json({ error: 'You are not allowed to do this action' });
                return;
            }

            const { hackathonId, taskId } = req.params;
            const hackathon = await Hackathon.findByPk(+hackathonId);
            if (!hackathon) {
                return res.status(404).json({ error: 'Hackathon not found' });
            }

            const task = await Task.findOne({ where: { hackathon_id: hackathon.id, id: +taskId } });
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }

            const { name, description, maxScore, type, answer, wrong1, wrong2, wrong3 } = req.body;

            await task.update({
                name,
                description,
                maxScore,
                type,
                answer,
                wrong1,
                wrong2,
                wrong3
            });

            res.status(200).json(task);
        } catch (err) {
            res.status(500).json(err);
        }
    })

    .delete(async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                res.status(403).json({ error: 'You are not allowed to do this action' });
                return;
            }

            const { hackathonId, taskId } = req.params;
            const hackathon = await Hackathon.findByPk(+hackathonId);
            if (!hackathon) {
                return res.status(404).json({ error: 'Hackathon not found' });
            }

            const task = await Task.findOne({ where: { hackathon_id: hackathon.id, id: +taskId } });
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }

            await task.destroy();

            res.status(200).end();
        } catch (err) {
            res.status(500).json(err);
        }
    });

module.exports = TaskApiRouter;
