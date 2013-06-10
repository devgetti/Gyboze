var util = require('ui/util');
var styles = require('ui/handheld/loginWindow/styles');

exports.btnLoginClick = function(param) {
	var self = this;
	
	// Validate
	
	// Login
	//self.delegate.fireEvent('procPause', {});
	self.model.session.login(self.win.txtUserId.value, self.win.txtPassword.value, function(result) {
		//self.delegate.fireEvent('procResume', {});
		if(result.success) {
			self.win.close();
			if(self.win.callback) {
				self.win.callback();
			}
			//self.delegate.fireEvent('login', { userId: self.win.txtUserId.value, password: self.win.txtPassword.value });

		} else {
			alert('ユーザ、パスワードがおかしいとか');
		}
	});
};

