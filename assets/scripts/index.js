'use strict';

// This will serve as the main manifest for all JS imports
// i.e. (require('./example.js'));
// require('./test.js');

// Require's Bootstrap JS
require('../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js');
let main = require('./main.js');
// Document Ready function
$(() => {
  main.initialEventHandlers();
});
