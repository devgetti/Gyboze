var util = require('ui/util');
var styles = require('ui/common/mainTabGroup/styles');

function mainTabGroup(model, delegate) {
	var self = this;
	var tabGroup = Ti.UI.createTabGroup();

	// === Component ===============
	var scheduleTab = new (require('ui/baseTab'))(styles.scheduleTab, model, delegate);
	var todoTab = new (require('ui/baseTab'))(styles.todoTab, model, delegate);
	var boardTab = new (require('ui/baseTab'))(styles.boardTab, model, delegate);
	var cabinetTab = new (require('ui/baseTab'))(styles.cabinetTab, model, delegate);
	var otherTab = new (require('ui/baseTab'))(styles.otherTab, model, delegate);

	scheduleList = new (require('ui/handheld/scheduleListWindow/view'))(model, delegate, scheduleTab);
	todoList = new (require('ui/handheld/todoListWindow/view'))(model, delegate, todoTab);
	boardList = new (require('ui/handheld/boardListWindow/view'))(model, delegate, boardTab);
	cabinetList = new (require('ui/handheld/cabinetListWindow/view'))(model, delegate, cabinetTab);
	otherList = new (require('ui/handheld/otherWindow/view'))(model, delegate, otherTab);

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

