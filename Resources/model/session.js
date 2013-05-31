var util = require('model/util');

function session(db, cyboze) {
	this.__super__();
	this.db = db;
	this.cyboze = cyboze;
	this.listeners = {};
};
module.exports = util.inherit(session, require('model/base'));

session.prototype.login = function(userId, password, callback) {
	var self = this;
	
	// Validate
	
	
	// Authorize
	self.cyboze.xauthorize(userId, password, function(data) {
		if(data.success) {
			Ti.App.Properties.setString('CybozeAccessToken', data.accessTokenKey);
			Ti.App.Properties.setString('CybozeAccessSecret', data.accessTokenSecret);
			self.fireEvent('login', { data: data});
		}
		if(callback) callback(data);
	});
};

