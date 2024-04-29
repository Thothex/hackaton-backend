const OrganizationApiRouter = require('express').Router();
const { Organizations, UserOrganizations, User, Hackathon } = require('../../../db/models');
const upload = require('../../../middleware/picture');
const path = require('path');
const fs = require('fs');
const {de} = require("@faker-js/faker");
const {or} = require("sequelize");
OrganizationApiRouter.get('/organizations', async (req, res) => {
      try {
        const organizations = await Organizations.findAll({
          attributes: ['id', 'name'],
        });

        const organizationsWithTotalPeople = await Promise.all(organizations.map(async (org) => {
          const totalPeople = await UserOrganizations.count({ where: { organization_id: org.id } });
          return { id: org.id, name: org.name, totalPeople };
        }));

        res.status(200).json(organizationsWithTotalPeople);
      } catch (err) {
        res.status(500).json(err);
      }
    })
    .post('/organizations/new', upload.single('picture'), async (req, res) => {
        try {
            const { name, description } = req.body;

            if (!req.file) {
                return res.status(400).json({ error: 'Изображение не загружено' });
            }

            const existingOrganization = await Organizations.findOne({ where: { name } });
            if (existingOrganization) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ error: 'Организация с таким именем уже существует' });
            }

            const newOrganization = await Organizations.create({
                name,
                description,
                picture: req.file.filename
            });

            res.status(201).json(newOrganization);
        } catch (err) {
            console.error('Ошибка при создании организации:', err);
            res.status(500).json({ error: 'Не удалось создать организацию' });
        }
    })
    .get('/organizations/:id', async (req, res) => {
        try {
            const { id } = req.params;

            const organization = await Organizations.findOne({ where: { id } });

            if (!organization) {
                return res.status(404).json({ error: 'Организация не найдена' });
            }

            const userOrgs = await UserOrganizations.findAll({ where: { organizationId: id }, raw: true });
            const userIds = userOrgs.map(userOrg => userOrg.userId);
            const users = await User.findAll({ where: { id: userIds }, raw: true });
            const organizers = await User.findAll({ where: { isOrg: true }, raw: true });
            // const hackathons = await Promise.all(organizers.map(async (organizer) => {
            //     return await Hackathon.findAll({ where: { organizer_id: organizer.id }, raw: true });
            // }));
            const hackathons = await Hackathon.findAll({where:{organizer_id:organization.id }})

            res.status(200).json({ organization, users, hackathons, totalPeople: userOrgs.length });
        } catch (error) {
            console.error('Ошибка при получении данных об организации, пользователях и хакатонах:', error);
            res.status(500).json({ error: 'Не удалось получить данные' });
        }
    });




module.exports = OrganizationApiRouter;
