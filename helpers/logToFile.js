let fs = require('fs');
const ERROR_FILE = './logs/error-log.txt';

let logToFileHelper = {};

logToFileHelper.error = function (data, resolve, reject) {
    let toWrite = `
        ${"*".repeat(80)}
        Date/Time: ${new Date().toJSON()}
        Exception Info: ${JSON.stringify(data)}
        ${"*".repeat(80)} `;

    fs.appendFile(ERROR_FILE, toWrite, function (err) {
        if (err) reject(err);
        else resolve(true);
    });
}

module.exports = logToFileHelper;
