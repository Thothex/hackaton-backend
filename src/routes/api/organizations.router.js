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
            const { name, description, link, userID } = req.body;
            const user = await User.findByPk(userID);

            if(user.role !== 'admin'){
                return res.status(403).json({message:'Unauthorized'})
            }

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
                link,
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
            const users = await User.findAll({ where: { id: userIds },  attributes: { exclude: ['password'] }, raw: true });
            const organizers = await User.findAll({ where: { isOrg: true },   attributes: { exclude: ['password'] }, raw: true });
            const hackathons = await Hackathon.findAll({where:{organizer_id:organization.id }})

            res.status(200).json({ organization, users, hackathons, totalPeople: userOrgs.length });
        } catch (error) {
            console.error('Ошибка при получении данных об организации, пользователях и хакатонах:', error);
            res.status(500).json({ error: 'Не удалось получить данные' });
        }
    })
    .get('/organizations/organizer/:organizerId', async (req, res) => {
        try {
            const { organizerId } = req.params;

            const userOrg = await UserOrganizations.findOne({ where: { userId: organizerId } });
            if (!userOrg) {
                return res.status(404).json({ error: "User organization not found" });
            }

            const organization = await Organizations.findByPk(userOrg.organizationId);
            if (!organization) {
                return res.status(404).json({ error: "Organization not found" });
            }

            const userOrgs = await UserOrganizations.findAll({ where: { organizationId: organization.id }, raw: true });
            const userIds = userOrgs.map(userOrg => userOrg.userId);
            const users = await User.findAll({ where: { id: userIds }, attributes: { exclude: ['password'] }, raw: true });

            const hackathons = await Hackathon.findAll({ where: { organizer_id: organization.id } });

            res.status(200).json({
                organization,
                users,
                hackathons,
                totalPeople: userOrgs.length
            });
        } catch (err) {
            console.error("Error:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    })
.put('/organizations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description,link, userID } = req.body;

        const user = await User.findByPk(userID, {
            include: [
                {
                    model: Organizations,
                    as: 'organizations',
                    through: {
                        model: UserOrganizations,
                        as: 'user_organizations',
                        where: {
                            organizationId: id
                        }
                    }
                }
            ]
        });

        if (!user || (!user.organizations || !user.organizations.length) && !user.isOrg && user.role !== 'admin') {
            console.log("Access denied:", user);
            return res.status(403).json({ error: 'You are not allowed to perform this action' });
        }


        const organization = await Organizations.findByPk(id);

        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        if (name) organization.name = name;
        if (description) organization.description = description;
        if (link) organization.link = link;

        await organization.save();

        return res.status(200).json(organization);
    } catch (error) {
        console.error('Error updating organization:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});




module.exports = OrganizationApiRouter;
