var util = require('ui/util');
var styles = require('ui/handheld/loginWindow/styles');

function loginWindow(model, delegate) {
	this.__super__(styles.win, model, delegate);
	
	var win = this.window;
	
	// === Component ===============
	win.lblUserId = Ti.UI.createLabel(styles.lblUserId);
	win.txtUserId = Ti.UI.createTextField(styles.txtUserId);
	win.lblPassword = Ti.UI.createLabel(styles.lblPassword);
	win.txtPassword = Ti.UI.createTextField(styles.txtPassword);
	win.btnLogin = Ti.UI.createButton(styles.btnLogin);
	
	// --- Layout ---
	util.setViewRect(win.lblUserId, '10%', '30%', '20%', '7%');
	util.setViewRect(win.txtUserId, '40%', '30%', '60%', '7%');
	util.setViewRect(win.lblPassword, '10%', '40%', '20%', '7%');
	util.setViewRect(win.txtPassword, '40%', '40%', '60%', '7%');
	util.setViewRect(win.btnLogin, '10%', '50%', '80%', '10%');
	
	// --- Add ---
	win.add(win.lblUserId);
	win.add(win.txtUserId);
	win.add(win.lblPassword);
	win.add(win.txtPassword);
	win.add(win.btnLogin);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/loginWindow/logics'))(win, model, delegate);

	// -- Events From User ---
	win.btnLogin.addEventListener('click', function(result) { logics.btnLoginClick(); });

	// --- Events From Model ---
	//model.session.addEventListener('login', function(result) { logics.login(result); });
	
};
module.exports = util.inherit(loginWindow, require('ui/baseWindow'));

loginWindow.prototype.open = function(callback) {
	this.window.callback = callback;
	return this.window.open();

};
