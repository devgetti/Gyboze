var util = require('ui/util');
var styles = require('ui/handheld/otherWindow/styles');

function otherWidnow(model, delegate) {
	this.__super__(styles.win, model, delegate);
	
	var win = this.window;
	
	// === Component ===============
	win.lblUserId = Ti.UI.createLabel(styles.lblUserId);
	win.txtUserId = Ti.UI.createTextField(styles.txtUserId);
	win.btnResync = Ti.UI.createButton(styles.btnResync);
	win.btnLogout = Ti.UI.createButton(styles.btnLogout);
	
	// --- Layout ---
	util.setViewRect(win.lblUserId, '10%', '30%', '20%', '7%');
	util.setViewRect(win.txtUserId, '40%', '30%', '60%', '7%');
	util.setViewRect(win.btnResync, '10%', '50%', '80%', '10%');
	util.setViewRect(win.btnLogout, '10%', '60%', '80%', '10%');
	
	// --- Add ---
	win.add(win.lblUserId);
	win.add(win.txtUserId);
	win.add(win.btnResync);
	win.add(win.btnLogout);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/otherWindow/logics'))(win, model, delegate);

	// -- Events From User ---
	win.btnResync.addEventListener('click', function(e) { logics.btnResyncClick(e); })

	// --- Events From Model ---
	
};
module.exports = util.inherit(otherWidnow, require('ui/baseWindow'));
