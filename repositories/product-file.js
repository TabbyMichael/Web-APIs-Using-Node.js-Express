// Load the node file system module
const fs = require('fs');

// Path/file name to the product data
const DATA_FILE = './db/product-bad.json';

// Product repository object
let repo = exports = module.exports = {};

// Retrieve all products
repo.getAll = function (resolve, reject) {
    fs.readFile(DATA_FILE, (err, data) => {
      if (err) {
        console.error("Error reading data file: ", err); // Log the error
        reject(err);
      } else {
        let products = JSON.parse(data);
        resolve(products);
      }
    });
  };
  

// Retrieve a single product object by ID
repo.getById = function (id, resolve, reject) {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      reject(err);
    } else {
      let products = JSON.parse(data);
      let product = products.find(row => row.productID == id);
      resolve(product);
    }
  });
};

// Search for products
repo.search = function (search, resolve, reject) {
  if (search) {
    fs.readFile(DATA_FILE, (err, data) => {
      if (err) {
        reject(err);
      } else {
        let products = JSON.parse(data);
        products = products.filter(row => 
          (search.name ? row.name.toLowerCase().indexOf(search.name.toLowerCase()) >= 0 : true) &&
          (search.listPrice ? parseFloat(row.listPrice) > parseFloat(search.listPrice) : true)
        );
        resolve(products);
      }
    });
  }
};

// Insert a new product object
repo.insert = function (newData,
    resolve, reject        ) {
    fs.readFile(DATA_FILE, function (err, data) {
      if (err) {
        // ERROR: Invoke reject() callback
        reject(err);
      }
      else {
        // SUCCESS: convert data to JSON
        let products = JSON.parse(data);
        // Add new product to array
        products.push(newData);
        // Stringify the product array
        // Save array to the file
        fs.writeFile(DATA_FILE, 
          JSON.stringify(products), 
          function (err) {
          if (err) {
            // ERROR: Invoke reject() callback
            reject(err);
          }
          else {
            // SUCCESS: Invoke resolve() callback
            resolve(newData);
          }
        });
      }
    });
  }
  
// Update an existing product object
repo.update = function (changedData, id, resolve, reject) {
    fs.readFile(DATA_FILE, function (err, data) {
      if (err) {
        // ERROR: Invoke reject() callback
        reject(err);
      } else {
        // SUCCESS: Convert to JSON
        let products = JSON.parse(data);
        // Find the product to update
        let product = products.find(row => row.productID == id);
        if (product) {
          // Move changed data into corresponding properties of the existing object
          Object.assign(product, changedData);
          // Stringify the product array and save it back to the file
          fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), function (err) {
            if (err) {
              // ERROR: Invoke reject() callback
              reject(err);
            } else {
              // SUCCESS: Invoke resolve() callback
              resolve(product);
            }
          });
        } else {
          // If the product isn't found, invoke reject
          reject(new Error(`Product with ID ${id} not found`));
        }
      }
    });
  }

// Delete an existing product object
repo.delete = function (id, resolve, reject) {
    fs.readFile(DATA_FILE, function (err, data) {
      if (err) {
        // ERROR: Invoke reject() callback
        reject(err);
      }
      else {
        // SUCCESS: Convert data to JSON
        let products = JSON.parse(data);
        // Find product to delete
        let index = products.findIndex(
          row => row.productID == id);
        if (index != -1) {
          // Remove row from array
          products.splice(index, 1);
          fs.writeFile(DATA_FILE,
            JSON.stringify(products),
            function (err) {
            if (err) {
              // ERROR: Invoke reject() callback
              reject(err);
            }
            else {
              // SUCCESS: Invoke resolve() callback
              resolve(index);
            }
          });
        }
      }
    });
  }
  