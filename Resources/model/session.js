var util = require('model/util');

function session(db, cyboze) {
	this.db = db;
	this.cyboze = cyboze;
	this.listeners = {};
};
session.prototype = util.createObject(require('model/base'));

session.prototype.login = function(userId, password) {
	var self = this;
	
	// Validate
	
	
	// Authorize
	self.cyboze.xauthorize(userId, password, function(data) {
		if(data.success) {
			Ti.App.Properties.setString('CybozeAccessToken', data.accessTokenKey);
			Ti.App.Properties.setString('CybozeAccessSecret', data.accessTokenSecret);
		}
		self.fireEvent('login', { data: data});
	});
};



module.exports = session;
