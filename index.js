const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: path.join(__dirname, "waitlist")});

const uploads = path.join(__dirname, "uploads");

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const uniqueId = uuidv4();

    fs.mkdirSync(path.join(uploads, uniqueId));
    fs.rename(req.file.path, path.join(path.join(uploads, uniqueId), req.file.originalname), (err) => {
        if (err) {
            return res.status(500).send('Error saving file.');
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/files/${uniqueId}/${req.file.originalname}`;

        res.json({ fileUrl: fileUrl });
    })
});

app.use('/files', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
