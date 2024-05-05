const express = require('express');
const crypto = require('crypto');

const { User } = require('../../../db/models/index');
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const RecoverAPIRouter = express.Router();

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD,
    },
});

RecoverAPIRouter.post('/recover-email', async (req, res) => {
    try {
        const today = new Date();
        const dateString = today.toISOString().slice(0, 10);
        const randomKey = crypto.randomBytes(10).toString('hex');
        const token = crypto.createHash('sha256').update(dateString + randomKey).digest('hex');

        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User doesn't exist" });
        }

        user.token = token;
        await user.save();

        await transporter.sendMail({
            from: `${process.env.MAIL_ACCOUNT}`,
            to: email,
            subject: 'Password recovery',
            html: `<h3>Dear ${user.username},</h3>
                <h4>We have received a request to reset the password for your account on 
                <a href="thothex.com">Thothex.hackathon</a>. To regain access to your account, 
                please follow the link below:</h4>  
                <a  href="${process.env.CLIENT_URL}/recover/${email}/${token}">Recover password</a>`,
        });

        return res.status(200).json({ message: 'Check your email to recover password' });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

RecoverAPIRouter.put('/recover', async(req,res)=>{
    try{
        const { email, password, repeatPassword, token } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User doesn't exist" });
        }

        if (user.token !== token) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.token = null;
        await user.save();

        res.status(200).json({ message: 'Password successfully saved' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = RecoverAPIRouter;
