'use strict';

var mongoose = require('mongoose');

module.exports.url = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/levelpad';

// Connect to our database
mongoose.connect(module.exports.url);
