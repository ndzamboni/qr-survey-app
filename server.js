const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const doc = new GoogleSpreadsheet('1Lsj_arRSXaAW7mGijxdSSBv9ylOBWcaxiy1L_68R2_0');

// Authentication with Google Sheets
async function accessSpreadsheet() {
  await doc.useServiceAccountAuth(require('./credentials.json'));
  await doc.loadInfo();
}

// Generate QR Code for each membership type
app.get('/generate-qr/:membership', (req, res) => {
  const membership = req.params.membership;
  const surveyUrl = `https://qr-survey-app.onrender.com/survey?membership=${membership}`;
  
  QRCode.toDataURL(surveyUrl, (err, url) => {
    if (err) res.send('Error occurred');
    res.send(`<img src="${url}">`);
  });
});

// Receive survey responses
app.post('/submit-survey', async (req, res) => {
  const { membership, responses } = req.body;
  await accessSpreadsheet();
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({ Membership: membership, ...responses });
  res.send('Survey submitted successfully');
});

app.listen(3000, () => console.log('Server running on port 3000'));
