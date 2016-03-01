const fs     = require('fs');
const dialog = require('electron').dialog;

fs.readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
