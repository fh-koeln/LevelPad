'use strict';

// The team model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var teamSchema = new Schema({
	members: [{type: ObjectId, ref: 'Member', required: true}]
});


module.exports = mongoose.model('Team', teamSchema);
