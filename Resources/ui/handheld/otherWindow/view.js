var util = require('ui/util');
var styles = require('ui/handheld/otherWindow/styles');
var logics = require('ui/handheld/otherWindow/logics');

function otherWidnow(model, delegate, parent) {
	this.__super__(styles.win, model, delegate, parent);
	var self = this;
	var win = this.win;
	
	// === Component ===============
	win.btnResync = Ti.UI.createButton(styles.btnResync);
	
	// --- Layout ---
	util.setViewRect(win.btnResync, '10%', '50%', '80%', '10%');
	
	// --- Add ---
	win.add(win.btnResync);
	
	// === Logics ====================
	// -- Events From User ---
	win.btnResync.addEventListener('click', function(e) { self.btnResyncClick(e); })

	// --- Events From Model ---
	
};
module.exports = util.inherit(otherWidnow, require('ui/baseWindow'));
util.expandFnc(otherWidnow, logics);
