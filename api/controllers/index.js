const fs = require("fs");
const path = require("path");
const basename = path.basename(module.filename);

let controller = {};

fs.readdirSync(__dirname)
  .filter(function(file) {
    // if a file is not hidden, if it is not this file, and if it is a .js file
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(function(file) {
    controller[file.slice(0, -3)] = require(path.join(__dirname, file));
  });


module.exports = controller;
