exports.index = function(req, res){
	res.send('user index');
};

exports.create = function(req, res){
	res.send('create user');
};

exports.show = function(req, res){
	res.send('show user ' + req.params.user);
};

exports.update = function(req, res){
	res.send('update user ' + req.params.user);
};

exports.destroy = function(req, res){
	res.send('destroy user ' + req.params.user);
};

/* ????
var people = express.Router();

people.get(function(req, res, next) {
});

people.post(function(req, res, next) {
});

people.get('/:id', function(req, res, next) {
});

people.put('/:id', function(req, res, next) {
});

people.delete('/:id', function(req, res, next) {
});

module.exports.people = people;
*/
