const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/generate-qr', (req, res) => {
    // Your QR code generation logic
});

app.get('/select-membership', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/survey', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'survey.html'));
});

app.post('/submit-survey', (req, res) => {
    const membership = req.body.membership;
    const data = req.body;

    if (!fs.existsSync('surveys')) {
        fs.mkdirSync('surveys');
    }

    fs.writeFile(`surveys/${membership}.json`, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/success');
        }
    });
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
