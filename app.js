const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Update the path to use persistent storage
const surveysPath = path.join(__dirname, 'surveys');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const surveyQuestions = {
  'Adult': ['If you have children aged 8-12, would you see them using this space?', 'Would you sign your children up for a fitness program in this area for a small fee?', 'Would you consider renting this space for a party or event?', 'Would you personally be interested in this space for private training or classes?', 'Is there anything you would like to see added to this space?'],
  'Adult with children': ['Would your children use this space for drop in care?', 'Would you sign your children up for a fitness program in this area for a small fee?', 'Would you consider renting this space for a party or event?', 'In your opinion, does this space add to the value of your family membership?', 'Is there anything you would like to see added to this space?'],
  'Teen': ['Does this space appeal to you?', 'What is your favorite part of this space?', 'Is there anything you would like to see added to this space?'],
  'Senior': ['Would you be interested in senior wellness programs in this space?', 'What is your favorite part of this space?', 'Would using this space add value to your membership?', 'Is there anything you would like to see added to this space?'],
  'Silver Sneaker': ['Would you be interested in senior wellness programs in this space?', 'What is your favorite part of this space?', 'Would using this space add value to your membership?', 'Is there anything you would like to see added to this space?'],
  'No Membership': ['Would use of this space give you incentive to sign up for a membership?', 'What is your favorite part of this space?', 'Would you sign your children up for a fitness program in this area for a small fee?', 'Would you consider renting this space for a party or event?', 'Is there anything you would like to see added to this space?']
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
  const filePath = path.join(surveysPath, `${membership}.json`);

  // Ensure the surveys directory exists
  if (!fs.existsSync(surveysPath)) {
    console.log(`Creating directory: ${surveysPath}`);
    fs.mkdirSync(surveysPath, { recursive: true });
  } else {
    console.log(`Directory already exists: ${surveysPath}`);
  }

  // Read existing surveys
  fs.readFile(filePath, (err, data) => {
    let surveys = [];
    if (!err) {
      surveys = JSON.parse(data);
    }
    surveys.push({ membership, responses });

    // Write updated surveys
    fs.writeFile(filePath, JSON.stringify(surveys, null, 2), (err) => {
      if (err) {
        console.error('Error saving survey data:', err);
        return res.status(500).send('Error saving survey data');
      }
      console.log(`Survey data saved for membership: ${membership}`);
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
