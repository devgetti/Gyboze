var util = require('ui/util');
var styles = require('ui/common/mainTabGroup/styles');

function mainTabGroup(model, delegate) {
	var self = this;
	var tabGroup = Ti.UI.createTabGroup();

	// === Component ===============
	scheduleList = new (require('ui/handheld/scheduleListWindow/view'))(model, delegate);
	todoList = new (require('ui/handheld/todoListWindow/view'))(model, delegate);
	boardList = new (require('ui/handheld/boardListWindow/view'))(model, delegate);
	cabinetTab = new (require('ui/handheld/cabinetListWindow/view'))(model, delegate);
	otherTab = new (require('ui/handheld/otherWindow/view'))(model, delegate);
	
	var scheduleTab = new (require('ui/baseTab'))(styles.scheduleTab, model, delegate, scheduleList);
	var todoTab = new (require('ui/baseTab'))(styles.todoTab, model, delegate, todoList);
	var boardTab = new (require('ui/baseTab'))(styles.boardTab, model, delegate, boardList);
	var cabinetTab = new (require('ui/baseTab'))(styles.cabinetTab, model, delegate, cabinetTab);
	var otherTab = new (require('ui/baseTab'))(styles.otherTab, model, delegate, otherTab);

	// --- Add ---
	tabGroup.addTab(scheduleTab.getTiTab());
	tabGroup.addTab(todoTab.getTiTab());
	tabGroup.addTab(boardTab.getTiTab());
	tabGroup.addTab(cabinetTab.getTiTab());
	tabGroup.addTab(otherTab.getTiTab());
	
	self.tabGroup = tabGroup;
};

module.exports = mainTabGroup;

mainTabGroup.prototype.open = function() {
	return this.tabGroup.open();
};

