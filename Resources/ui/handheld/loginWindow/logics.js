var util = require('ui/util');

function logics(win, model, delegate) {
	this.win = win;
	this.model = model;
	this.delegate = delegate;
};
module.exports = logics;

logics.prototype.btnLoginClick = function(param) {
	var self = this;
	
	// Validate
	
	// Login
	self.delegate.fireEvent('procPause', {});
	self.model.session.login(self.win.txtUserId.value, self.win.txtPassword.value, function(result) {
		self.delegate.fireEvent('procResume', {});
		if(result.success) {
			self.close();
			if(self.win.callback) {
				self.win.callback();
			}
			//self.delegate.fireEvent('login', { userId: self.win.txtUserId.value, password: self.win.txtPassword.value });

		} else {
			alert('ユーザ、パスワードがおかしいとか');
		}
	});
};

