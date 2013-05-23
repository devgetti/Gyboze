var util = require('ui/util');

function loginWindow(model, delegate) {
	var styles = require('ui/handheld/loginWindow/styles');
	var self = Ti.UI.createWindow(styles.win);

	// === Component ===============
	self.lblUserId = Ti.UI.createLabel(styles.lblUserId);
	self.txtUserId = Ti.UI.createTextField(styles.txtUserId);
	self.lblPassword = Ti.UI.createLabel(styles.lblPassword);
	self.txtPassword = Ti.UI.createTextField(styles.txtPassword);
	self.btnLogin = Ti.UI.createButton(styles.btnLogin);
	
	// --- Layout ---
	util.setViewRect(self.lblUserId, '10%', '30%', '20%', '7%');
	util.setViewRect(self.txtUserId, '40%', '30%', '60%', '7%');
	util.setViewRect(self.lblPassword, '10%', '40%', '20%', '7%');
	util.setViewRect(self.txtPassword, '40%', '40%', '60%', '7%');
	util.setViewRect(self.btnLogin, '10%', '50%', '80%', '10%');
	
	// --- Add ---
	self.add(self.lblUserId);
	self.add(self.txtUserId);
	self.add(self.lblPassword);
	self.add(self.txtPassword);
	self.add(self.btnLogin);
	
	// === Event ====================
	var logics = new (require('ui/handheld/loginWindow/logics'))(self, model, delegate);

	// -- From User ---
	self.btnLogin.addEventListener('click', function(result) { logics.btnLoginClick(); });

	// -- From Model ---
	model.session.addEventListener('login', function(result) { logics.login(result); });

	self.txtUserId.value = 'a-kosuge@netwrk.co.jp';
	
	return self;
};

module.exports = loginWindow;
