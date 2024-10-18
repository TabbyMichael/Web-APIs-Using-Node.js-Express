let errorHelper = {};

// Build error object for internal logging
errorHelper.buildError = function (err, req) {
    return {
        "status": 500,
        "statusText": 'Internal Server Error',
        "message": err.message,
        "stack": err.stack ?? 'n/a',
        "originalError": err,
        "requestInfo": {
            "hostname": req.hostname ?? 'Unknown',
            "path": req.path ?? 'Unknown'
        }
    };
}

// Log error information to console
errorHelper.errorToConsole = function (err, req, res, next) {
    let errObject = errorHelper.buildError(err, req);
    console.error(`Log Entry: ${JSON.stringify(errObject)}`);
    console.error("*".repeat(80));
    next(err);
}

// Final error middleware, sending generic response to clients
errorHelper.errorFinal = function (err, req, res, next) {
    res.status(500).send({
        "status": 500,
        "statusText": 'Internal Server Error',
        "message": 'An error occurred; please contact the system administrator.'
    });
}

let logToFileHelper = require('./logToFile');

// Log error information to a file
errorHelper.errorToFile = function (err, req, res, next) {
    let errorObject = errorHelper.buildError(err, req);
    logToFileHelper.error(errorObject, 
        function (data) { console.log('Error logged to file'); }, 
        function (err) { console.error('File log failed', err); }
    );
    next(err);
}


module.exports = errorHelper;
