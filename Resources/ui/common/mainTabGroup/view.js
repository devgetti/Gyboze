var util = require('ui/util');

function mainTabGroup(model, delegate) {
	var styles = require('ui/common/mainTabGroup/styles');
	var self = Ti.UI.createTabGroup();

	// === Component ===============
	self.scheduleTab = Ti.UI.createTab(styles.scheduleTab);
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
	
	boardList = new (require('ui/handheld/boardListWindow/view'))(model, delegate);
	boardList.setTab(self);
	
	self.scheduleTab.window = new (require('ui/handheld/scheduleListWindow/view'))(model, delegate);
	self.todoTab.window = new (require('ui/handheld/todoListWindow/view'))(model, delegate);
	self.boardTab.window = boardList.getWindow();
	self.cabinetTab.window = new (require('ui/handheld/cabinetListWindow/view'))(model, delegate);
	self.otherTab.window = new (require('ui/handheld/otherWindow/view'))(model, delegate);
	
	// === Logics ====================
	var logics = new (require('ui/common/mainTabGroup/logics'))(self, model, delegate);
	
	return self;
};

module.exports = mainTabGroup;
