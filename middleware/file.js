const multer = require('multer')
const path = require('path')
const fs = require('fs')
const countImages = require("../src/lib/parseJSONLayout");
const {Task, TeamAnswer} = require('../db/models')
const answerStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const {hackathonId} = req.body
    const {teamId} = req.body
    const {taskId} = req.body

    const basePath = path.join('public', 'answers', String(hackathonId), String(teamId), String(taskId))

    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, {recursive: true})
    }

    const task = await Task.findByPk(taskId);
    const teamAns = await TeamAnswer.findOne({where: {task_id: taskId, team_id: teamId}});

    if (task.isJSONchem && file.mimetype === 'application/json') {


      if (fs.existsSync(`${basePath}/${file.originalname}`)) {
        fs.readFile(`${basePath}/${file.originalname}`, 'utf8', async (err, data) => {
          if (err) {
            console.error('Error reading file:', err);
            return;
          }
          if (data.trim() === '') {
            console.error('File is empty:',`${basePath}/${file.originalname}` );
            return;
          }
          try {
            const newData = JSON.parse(data);
            const pages = countImages(newData.annotations);
            await teamAns.update({ pages: pages });
          } catch (jsonErr) {
            console.error('Error parsing JSON:', jsonErr);
          }
        });
      } else {
        console.error('File does not exist:', `${basePath}/${file.originalname}`);
      }
    }

    cb(null, basePath)
  },
  filename: (req, file, cb) => {
    const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, fileName)
  },
})

module.exports = multer({ storage: answerStorage })
