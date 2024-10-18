// Create an instance of a Router
const router = require('express').Router();

// Load product repository module
const repo = require('../repositories/product-file');

// Route for getting all products
router.get('/', (req, res, next) => {
  repo.getAll(function (data) {
    if (data) {
      res.send({
        status: 200,
        statusText: 'OK',
        message: 'All products retrieved successfully.',
        data: data,
      });
    } else {
      let msg = 'No products found.';
      res.status(404).send({
        status: 404,
        statusText: 'Not Found',
        message: msg,
        error: {
          code: 'NOT_FOUND',
          message: msg,
        },
      });
    }
  }, function (err) {
    next(err);
  });
});

// Route for searching products
router.get('/search', (req, res, next) => {
  let search = {
    name: req.query.name,
    listPrice: req.query.listPrice,
  };
  if (search.name || search.listPrice) {
    repo.search(search, function (data) {
      if (data && data.length > 0) {
        res.send({
          status: 200,
          statusText: 'OK',
          message: 'Search was successful.',
          data: data,
        });
      } else {
        let msg = `The search for '${JSON.stringify(search)}' was not successful.`;
        res.status(404).send({
          status: 404,
          statusText: 'Not Found',
          message: msg,
          error: {
            code: 'NOT_FOUND',
            message: msg,
          },
        });
      }
    }, function (err) {
      next(err);
    });
  } else {
    let msg = 'No search parameters passed in.';
    res.status(400).send({
      status: 400,
      statusText: 'Bad Request',
      message: msg,
      error: {
        code: 'BAD_REQUEST',
        message: msg,
      },
    });
  }
});

// Route for getting product by ID
router.get('/:id', (req, res, next) => {
  repo.getById(req.params.id, function (data) {
    if (data) {
      res.send({
        status: 200,
        statusText: 'OK',
        message: 'Single product retrieved.',
        data: data,
      });
    } else {
      let msg = `The product '${req.params.id}' could not be found.`;
      res.status(404).send({
        status: 404,
        statusText: 'Not Found',
        message: msg,
        error: {
          code: 'NOT_FOUND',
          message: msg,
        },
      });
    }
  }, function (err) {
    next(err);
  });
});

// POST Route
router.post('/', function (req, res, next) {
    // Pass in the Body from request
    repo.insert(req.body, function(data) {
      // SUCCESS: Return status of 201 Created
      res.status(201).send({
        "status": 201,
        "statusText": "Created",
        "message": "New Product Added.",
        "data": data
      });
    }, function(err) {
      // ERROR: pass error along to 
      // the 'next' middleware
      next(err);
    });
  });
  
// PUT Route
router.put('/:id', function (req, res, next) {
    // Does product to update exist?
    repo.getById(req.params.id, function (data) {
      // SUCCESS: Product is found
      if (data) {
        // Pass in Body from request
        repo.update(req.body, req.params.id, function (data) {
          // SUCCESS: Return 200 OK
          res.send({
            "status": 200,
            "statusText": "OK",
            "message": `Product '${req.params.id}' updated.`,
            "data": data
          });
        }, function(err) {
          // Handle error from update function
          next(err);
        });
      } else {
        // Product not found
        let msg = `The product '${req.params.id}' could not be found.`;
        res.status(404).send({
          "status": 404,
          "statusText": "Not Found",
          "message": msg,
          "error": {
            "code": "NOT_FOUND",
            "message": msg
          }
        });
      }
    }, function(err) {
      // ERROR: pass error along to the 'next' middleware
      next(err);
    });
  });

// DELETE Route
router.delete('/:id', 
    function (req, res, next) {
    // Does product to delete exist?
    repo.getById(req.params.id, function (data) {
      // SUCCESS: Product is found
      if (data) {
        // Pass in 'id' from request
        repo.delete(req.params.id, function (data) {
          // SUCCESS: Return 204 No Content
          res.status(204).send();
        });
      }
      else {
        // Product not found
        let msg = `The product '${req.params.id}' could not be found.`
        res.status(404).send({
          "status": 404,
          "statusText": "Not Found",
          "message": msg,
          "error": {
            "code": "NOT_FOUND",
            "message": msg
          }
        });
      }
    }, function(err) {
      // ERROR: pass error along to 
      // the 'next' middleware
      next(err);
    });
  });
  

module.exports = router;
