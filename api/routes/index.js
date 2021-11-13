const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('../index.html', {
    title: 'Wizow'
  });
});

// reads current directory and adds routes to router
fs.readdirSync(__dirname)
  .filter(file => {
    // if file is not hidden
    return (file.indexOf('.') !== 0)
      // if its not the current file
      && (file !== basename)
      // if it is a .js file
      && (file.slice(-3) === '.js')
      // if it doesnt have multiple breaks e.g. users.old.js
      && (file.split('.').length === 2)
  })
  .forEach(file => {
    file = file.split('.')
    const route = '/' + file[0]
    router.use(route, require('.' + route))
  });


module.exports = router;
