const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const name = req.body.name;
        const basePath = path.join(__dirname, '..', 'public', 'organizations', name);
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, { recursive: true });
        }
        cb(null, basePath);
    },

    filename: (req, file, cb) => {
        const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, fileName);
    },
});

const upload = multer({ storage });

module.exports = upload;
