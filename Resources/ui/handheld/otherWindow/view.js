var util = require('ui/util');

function otherWindow(model, delegate) {
	var styles = require('ui/handheld/otherWindow/styles');
	var self = Ti.UI.createWindow(styles.win);
	
	// === Component ===============
	self.lblUserId = Ti.UI.createLabel(styles.lblUserId);
	self.txtUserId = Ti.UI.createTextField(styles.txtUserId);
	self.btnResync = Ti.UI.createButton(styles.btnResync);
	self.btnLogout = Ti.UI.createButton(styles.btnLogout);
	
	// --- Layout ---
	util.setViewRect(self.lblUserId, '10%', '30%', '20%', '7%');
	util.setViewRect(self.txtUserId, '40%', '30%', '60%', '7%');
	util.setViewRect(self.btnResync, '10%', '50%', '80%', '10%');
	util.setViewRect(self.btnLogout, '10%', '60%', '80%', '10%');
	
	// --- Add ---
	self.add(self.lblUserId);
	self.add(self.txtUserId);
	self.add(self.btnResync);
	self.add(self.btnLogout);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/otherWindow/logics'))(self, model, delegate);

	// -- Events From User ---
	self.btnResync.addEventListener('click', function(e) { logics.btnResyncClick(e); })

	// --- Events From Model ---
	
	return self;
};

module.exports = otherWindow;
