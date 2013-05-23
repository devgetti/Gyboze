var util = require('ui/util');

function scheduleListWindow(model, delegate) {
	var styles = require('ui/handheld/scheduleListWindow/styles');
	var self = Ti.UI.createWindow(styles.win);
	
	// === Component ===============
	self.tvSchedule = Ti.UI.createTableView(styles.tvSchedule);
	
	// --- Layout ---
	util.setViewRect(self.tvSchedule, 0, 0, '100%', '100%');
	
	// --- Add ---
	self.add(self.tvSchedule);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/scheduleListWindow/logics'))(self, model, delegate);

	// -- Events From User ---
	self.addEventListener('open', function(e) { logics.winOpen(); });
	self.tvSchedule.addEventListener('click', function(e) { logics.clickList(e); });

	// --- Events From Model ---
	model.schedule.addEventListener('updateSchedule', function(e) { logics.updateScheduleList(e); });
	
	return self;
};

module.exports = scheduleListWindow;
