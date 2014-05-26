var express = require('express'),
	subjects = express.Router();

subjects.use('/artifacts', require('./Artifacts'));

subjects.get('/', function(req, res, next) {
	res.send('subject index');
});

subjects.post('/', function(req, res, next) {
	res.send('create subject');
});

subjects.get('/:id', function(req, res, next) {
	res.send('update subject ' + req.params.subject);
});

subjects.put('/:id', function(req, res, next) {
	res.send('update subject ' + req.params.subject);
});

subjects.delete('/:id', function(req, res, next) {
	res.send('destroy subject ' + req.params.subject);
});

module.exports = subjects;
