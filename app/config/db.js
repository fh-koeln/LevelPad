"use strict";

var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/levelpad';

// connect to our database
mongoose.connect(mongoUri);
