var util = require('ui/util');
var styles = require('ui/handheld/cabinetListWindow/styles');

function cabinetListWindow(model, delegate) {
	this.__super__(styles.win, model, delegate);
	
	var win = this.window;
	
	// === Component ===============
	win.tvCabinet = Ti.UI.createTableView(styles.tvCabinet);
	
	// --- Layout ---
	util.setViewRect(win.tvCabinet, 0, 0, '100%', '100%');
	
	// --- Add ---
	win.add(win.tvCabinet);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/cabinetListWindow/logics'))(win, model, delegate);

	// -- Events From User ---
	win.addEventListener('open', function(e) { logics.winOpen(); });
	win.tvCabinet.addEventListener('click', function(e) { logics.clickList(e); });

	// --- Events From Model ---
	model.cabinet.addEventListener('updateCabinet', function(e) { logics.updateGroupInfo(e); });
	
};
module.exports = util.inherit(cabinetListWindow, require('ui/baseWindow'));

