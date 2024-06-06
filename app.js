const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const surveyQuestions = {
  'Adult': ['Question 1 for Adult', 'Question 2 for Adult'],
  'Adult with children': ['Question 1 for Adult with children', 'Question 2 for Adult with children'],
  'Teen': ['Question 1 for Teen', 'Question 2 for Teen'],
  'Senior': ['Question 1 for Senior', 'Question 2 for Senior'],
  'Silver Sneaker': ['Question 1 for Silver Sneaker', 'Question 2 for Silver Sneaker'],
  'No Membership': ['Question 1 for No Membership', 'Question 2 for No Membership']
};

// Endpoint to generate QR code
app.get('/generate-qr', (req, res) => {
  const surveyUrl = `http://localhost:${port}/select-membership`;

  QRCode.toDataURL(surveyUrl, (err, url) => {
    if (err) res.send('Error occurred');
    res.send(`<img src="${url}">`);
  });
});

// Endpoint to render membership selection form
app.get('/select-membership', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to serve survey page
app.get('/survey', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'survey.html'));
});

// Endpoint to handle survey submission
app.post('/submit-survey', (req, res) => {
  const { membership, responses } = req.body;
  const filePath = path.join(__dirname, 'surveys', `${membership}.json`);

  fs.readFile(filePath, (err, data) => {
    let surveys = [];
    if (!err) {
      surveys = JSON.parse(data);
    }
    surveys.push({ membership, responses });

    fs.writeFile(filePath, JSON.stringify(surveys, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error saving survey data');
      }
      res.redirect('/success');
    });
  });
});

// Endpoint to serve success page
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
