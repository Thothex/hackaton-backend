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
    .get('/organizations/:id/hackathon-organizers', async (req, res) => {
        try {
            const { id } = req.params;

            // Найти организацию по ID
            const organization = await Organizations.findOne({ where: { id } });

            // Если организация не найдена, вернуть ошибку
            if (!organization) {
                return res.status(404).json({ error: 'Организация не найдена' });
            }

            const organizers = await User.findAll({ where: { isOrg: true } });

            const hackathons = await Promise.all(organizers.map(async (organizer) => {
                return await Hackathon.findAll({where: {organizer_id: organizer.id}, raw: true});
            }));

            const totalPeople = await UserOrganizations.count({ where: { organization_id: id } });

            res.status(200).json({ organization, hackathons, totalPeople });
        } catch (error) {
            console.error('Ошибка при получении организаторов хакатона и их хакатонов:', error);
            res.status(500).json({ error: 'Не удалось получить данные' });
        }
    });





module.exports = OrganizationApiRouter;
