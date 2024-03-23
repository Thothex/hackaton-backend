const TeamApiRouter = require('express').Router();
const { Team, HackathonTeam, TeamUsers, User} = require('../../../db/models')
TeamApiRouter.post('/team', async (req, res) => {
    try {
        const { name, hackathonId } = req.body;
        const { user } = req;

        // Проверяем существование команды с таким же именем
        const existingTeam = await Team.findOne({ where: { name } });
        if (existingTeam) {
            return res.status(400).json({ message: 'Team with this name already exists' });
        }

        const newTeam = await Team.create({ name });
        await HackathonTeam.create({ hackathon_id: hackathonId, team_id: newTeam.id });
        await TeamUsers.create({ team_id: newTeam.id, user_id: user.id, is_captain: true });

        res.status(201).json(newTeam);
    } catch (err) {
        res.status(500).json({ message: 'Error creating team', error: err.message });
    }
});
TeamApiRouter.post('/team/invite', async (req, res) => {
    try {
        const { teamId, member, hackathonId } = req.body;

        const team = await Team.findByPk(teamId);
        console.log(teamId, '---------team')
        console.log(team, '---------team')
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Проверяем существование пользователя по email
        const user = await User.findOne({ where: { email: member } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Проверяем, есть ли пользователь уже в команде
        const existingTeamUser = await TeamUsers.findOne({ where: { team_id: teamId, user_id: user.id } });
        if (existingTeamUser) {
            return res.status(400).json({ message: 'User already in the team' });
        }

        // Создаем запись о пользователе в команде
        await TeamUsers.create({ team_id: teamId, user_id: user.id });

        res.status(201).json({ message: 'User added to the team' });
    } catch (err) {
        res.status(500).json({ message: 'Error inviting user to team', error: err.message });
    }
});
module.exports = TeamApiRouter;
