const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const surveysPath = '/var/data/surveys';
const backupPath = '/path/to/backup/directory';

fs.readdir(surveysPath, (err, files) => {
  if (err) {
    console.error('Error reading surveys directory:', err);
    return;
  }

  files.forEach(file => {
    const sourceFile = path.join(surveysPath, file);
    const destFile = path.join(backupPath, file);

    fs.copyFile(sourceFile, destFile, err => {
      if (err) {
        console.error(`Error copying file ${file}:`, err);
      } else {
        console.log(`Successfully backed up ${file}`);
      }
    });
  });
});

// Optional: Add git commands to commit and push to GitHub
exec('cd /path/to/backup/directory && git add . && git commit -m "Automated backup" && git push origin main', (err, stdout, stderr) => {
  if (err) {
    console.error('Error during git operations:', err);
    return;
  }
  console.log('Backup committed and pushed to GitHub');
});
