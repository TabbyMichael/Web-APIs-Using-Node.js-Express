// Load the express module
const express = require('express');

// Load the config module
const config = require('config');

// Load error helper module
const errorHelper = require('./helpers/error');

// Create an instance of express
const app = express();

// Create an instance of a Router
const router = express.Router();

// Configure JSON parsing in body of request object
app.use(express.json()); // <-- Add this line

// Get host, prefix, and port values from the configuration file
const host = config.get('host');
const prefix = config.get('prefix');
const port = config.get('port');

// Mount routes from modules
router.use('/product', require('./routes/product'));

// Configure router so all routes are prefixed with /api
app.use(prefix, router);

// Configure exception logger to console
app.use(errorHelper.errorToConsole);

// Configure exception logger to file
app.use(errorHelper.errorToFile);

// Configure final exception middleware
app.use(errorHelper.errorFinal);

// Create web server to listen on the specified port
let server = app.listen(port, function () {
    console.log(`AdvWorksAPI server is running on ${host}:${port}.`);
});
