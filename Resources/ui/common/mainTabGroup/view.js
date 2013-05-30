var util = require('ui/util');
var styles = require('ui/common/mainTabGroup/styles');

function mainTabGroup(model, delegate) {
	var self = Ti.UI.createTabGroup();

	// === Component ===============
	//self.scheduleTab = Ti.UI.createTab(styles.scheduleTab);
	self.scheduleTab = new (require('ui/baseTab'))(styles.scheduleTab, model, delegate);
	self.todoTab = Ti.UI.createTab(styles.todoTab);
	self.boardTab = Ti.UI.createTab(styles.boardTab);
	self.cabinetTab = Ti.UI.createTab(styles.cabinetTab);
	self.otherTab = Ti.UI.createTab(styles.otherTab);

	// --- Add ---
	self.addTab(self.scheduleTab);
	self.addTab(self.todoTab);
	self.addTab(self.boardTab);
	self.addTab(self.cabinetTab);
	self.addTab(self.otherTab);
	


	scheduleList = new (require('ui/handheld/scheduleListWindow/view'))(model, delegate);
	
/*
	boardList = new (require('ui/handheld/boardListWindow/view'))(model, delegate);
	boardList.setTab(self);
	*/
	//self.scheduleTab.setWindow(scheduleList);
	/*self.todoTab.window = new (require('ui/handheld/todoListWindow/view'))(model, delegate);
	self.boardTab.window = boardList.getWindow();
	self.cabinetTab.window = new (require('ui/handheld/cabinetListWindow/view'))(model, delegate);
	self.otherTab.window = new (require('ui/handheld/otherWindow/view'))(model, delegate);
	
	self.tagGroup = tabGroup;
	*/
	
	self.test = function() {
		alert('test');
	};
	
	return self;
};

module.exports = mainTabGroup;
