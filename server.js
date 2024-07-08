const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const app = express();
const port = 5000;

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static('public'));

app.post('/upload', upload.single('video'), (req, res) => {
    const videoBuffer = req.file.buffer;
    const convertedStream = ffmpeg()
        .input(videoBuffer)
        .inputFormat('webm')
        .toFormat('mp4')
        .pipe();

    axios.post('https://your-webhook-url.com', convertedStream, {
        headers: {
            'Content-Type': 'video/mp4'
        }
    })
    .then(response => {
        res.send('Video uploaded and sent to webhook!');
    })
    .catch(error => {
        console.error('Failed to send video to webhook:', error);
        res.status(500).send('Failed to send video to webhook');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
