var util = require('ui/util');

function cabinetListWindow(model, delegate) {
	var styles = require('ui/handheld/cabinetListWindow/styles');
	var self = Ti.UI.createWindow(styles.win);
	
	// === Component ===============
	self.tvCabinet = Ti.UI.createTableView(styles.tvCabinet);
	
	// --- Layout ---
	util.setViewRect(self.tvCabinet, 0, 0, '100%', '100%');
	
	// --- Add ---
	self.add(self.tvCabinet);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/cabinetListWindow/logics'))(self, model, delegate);

	// -- Events From User ---
	self.addEventListener('open', function(e) { logics.winOpen(); });
	self.tvCabinet.addEventListener('click', function(e) { logics.clickList(e); });

	// --- Events From Model ---
	model.cabinet.addEventListener('updateCabinet', function(e) { logics.updateGroupInfo(e); });	
	
	return self;
};

module.exports = cabinetListWindow;
