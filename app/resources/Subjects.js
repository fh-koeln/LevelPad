exports.index = function(req, res){
	res.send('subject index');
};

exports.new = function(req, res){
	res.send('new subject');
};

exports.create = function(req, res){
	res.send('create subject');
};

exports.show = function(req, res){
	res.send('show subject ' + req.params.subject);
};

exports.edit = function(req, res){
	res.send('edit subject ' + req.params.subject);
};

exports.update = function(req, res){
	res.send('update subject ' + req.params.subject);
};

exports.destroy = function(req, res){
	res.send('destroy subject ' + req.params.subject);
};
