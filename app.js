const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
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
app.get('/views', (req, res) => {
  res.render('select_membership');
});

// Endpoint to render survey form based on membership type
app.post('/survey', (req, res) => {
  const membership = req.body.membership;
  const questions = surveyQuestions[membership];
  if (!questions) {
    return res.status(404).send('Membership type not found');
  }
  res.render('form', { membership, questions });
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
      res.render('success', { membership });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
