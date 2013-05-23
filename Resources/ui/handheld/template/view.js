var util = require('ui/util');

function boardDetailWindow(model, delegate) {
	var styles = require('ui/handheld/boardDetailWindow/styles');
	var self = Ti.UI.createWindow(styles.win);
	
	// === Component ===============
	self.tvBoard = Ti.UI.createTableView(styles.tvBoard);
	self.lblTitle = Ti.UI.createLabel(styles.lblTitle);
	self.lblDetail = Ti.UI.createLabel(styles.lblDetail);
	
	self.tvrTitle = Ti.UI.createTableViewRow(styles.tvrTitle);
	self.tvrDetail = Ti.UI.createTableViewRow(styles.tvrDetail);
	self.tvrComment = [];
	
	// --- Layout ---
	util.setViewRect(self.tvBoard, 0, 0, '100%', '90%');
	
	// --- Add Component ---
	self.add(self.tvBoard);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/boardDetailWindow/events'))(model, delegate);

	// -- Events From User ---
	self.addEventListener('open', function(result) { logics.winOpen(); });

	// --- Events From Model ---
	
	return self;
};

module.exports = boardDetailWindow;
