var util = require('ui/util');
var styles = require('ui/handheld/scheduleListWindow/styles');

function scheduleListWindow(model, delegate) {
	this.__super__(styles.win, model, delegate);
	
	var win = this.window;
	
	// === Component ===============
	win.tvSchedule = Ti.UI.createTableView(styles.tvSchedule);
	
	// --- Layout ---
	util.setViewRect(win.tvSchedule, 0, 0, '100%', '100%');
	
	// --- Add ---
	win.add(win.tvSchedule);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/scheduleListWindow/logics'))(win, model, delegate);
	
	// -- Events From User ---
	win.addEventListener('open', function(e) { logics.winOpen(); });
	win.tvSchedule.addEventListener('click', function(e) { logics.clickList(e); });

	// --- Events From Model ---
	model.schedule.addEventListener('updateSchedule', function(e) { logics.updateScheduleList(e); });
	
};
module.exports = util.inherit(scheduleListWindow, require('ui/baseWindow'));


