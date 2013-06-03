var util = require('ui/util');
var styles = require('ui/handheld/otherWindow/styles');

function otherWidnow(model, delegate) {
	this.__super__(styles.win, model, delegate);
	
	var win = this.window;
	
	// === Component ===============
	win.btnResync = Ti.UI.createButton(styles.btnResync);
	
	// --- Layout ---
	util.setViewRect(win.btnResync, '10%', '50%', '80%', '10%');
	
	// --- Add ---
	win.add(win.btnResync);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/otherWindow/logics'))(win, model, delegate);

	// -- Events From User ---
	win.btnResync.addEventListener('click', function(e) { logics.btnResyncClick(e); })

	// --- Events From Model ---
	
};
module.exports = util.inherit(otherWidnow, require('ui/baseWindow'));
