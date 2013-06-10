var util = require('ui/util');
var styles = require('ui/handheld/scheduleListWindow/styles');
var logics = require('ui/handheld/scheduleListWindow/logics');

function scheduleListWindow(model, delegate, parent) {
	this.__super__(styles.win, model, delegate, parent);
	var self = this;
	var win = this.win;
	
	// === Component ===============
	win.tvSchedule = Ti.UI.createTableView(styles.tvSchedule);
	win.tvSchedule.search = function(){
		var search = Titanium.UI.createSearchBar({
			barColor:'#385292',
			showCancel:false,
			hintText:'search'
		});
		search.addEventListener('change', function(e) { e.value; });
		search.addEventListener('return', function(e) { search.blur(); });
		search.addEventListener('cancel', function(e) { search.blur(); });
		return search;
	}();
	
	// --- Layout ---
	util.setViewRect(win.tvSchedule, 0, 0, '100%', '100%');
	
	// --- Add ---
	win.add(win.tvSchedule);
	
	// === Logics ====================
	// -- Events From User ---
	win.addEventListener('open', function(e) { self.winOpen(e); });
	win.addEventListener('updateSchedule', function(e) { self.updateScheduleList(e); });
	win.tvSchedule.addEventListener('click', function(e) { self.clickList(e); });

	// --- Events From Model ---
	model.schedule.addEventListener('updateSchedule', function(e) { self.updateScheduleList(e); });
	
};
module.exports = util.inherit(scheduleListWindow, require('ui/baseWindow'));
util.expandFnc(scheduleListWindow, logics);
