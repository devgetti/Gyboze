var util = require('ui/util');

function logics(win, model, delegate) {
	this.win = win;
	this.model = model;
	this.delegate = delegate;
};

logics.prototype.btnLoginClick = function(param) {
	var self = this;
	
	// Validate
	
	// Login
	self.delegate.fireEvent('procPause', {});
	self.model.session.login(self.win.txtUserId.value, self.win.txtPassword.value);
};

logics.prototype.login = function(result) {
	var self = this;
	if(result.data.success) {
		self.delegate.fireEvent('login', { userId: self.win.txtUserId.value, password: self.win.txtPassword.value });
	} else {
		alert('ユーザ、パスワードがおかしいとか');
	}
	self.delegate.fireEvent('procResume', {});
};

module.exports = logics;
