exports.index = function(req, res){
	res.send('artifact index');
};

exports.new = function(req, res){
	res.send('new artifact');
};

exports.create = function(req, res){
	res.send('create artifact');
};

exports.show = function(req, res){
	res.send('show artifact ' + req.params.artifact + ' of subject ' + req.params.subject );
};

exports.edit = function(req, res){
	res.send('edit artifact ' + req.params.artifact);
};

exports.update = function(req, res){
	res.send('update artifact ' + req.params.artifact);
};

exports.destroy = function(req, res){
	res.send('destroy artifact ' + req.params.artifact);
};
