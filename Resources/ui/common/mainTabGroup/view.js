var util = require('ui/util');
var styles = require('ui/common/mainTabGroup/styles');

function mainTabGroup(model, delegate) {
	this.tabGroup = Ti.UI.createTabGroup();

	// === Component ===============
	scheduleList = new (require('ui/handheld/scheduleListWindow/view'))(model, delegate);
	todoList = new (require('ui/handheld/todoListWindow/view'))(model, delegate);
	boardList = new (require('ui/handheld/boardListWindow/view'))(model, delegate);
	cabinetTab = new (require('ui/handheld/cabinetListWindow/view'))(model, delegate);
	otherTab = new (require('ui/handheld/otherWindow/view'))(model, delegate);
	
	this.tabGroup.scheduleTab = new (require('ui/baseTab'))(styles.scheduleTab, model, delegate, scheduleList);
	this.tabGroup.todoTab = new (require('ui/baseTab'))(styles.todoTab, model, delegate, todoList);
	this.tabGroup.boardTab = new (require('ui/baseTab'))(styles.boardTab, model, delegate, boardList);
	this.tabGroup.cabinetTab = new (require('ui/baseTab'))(styles.cabinetTab, model, delegate, cabinetTab);
	this.tabGroup.otherTab = new (require('ui/baseTab'))(styles.otherTab, model, delegate, otherTab);

	// --- Add ---
	this.tabGroup.addTab(this.tabGroup.scheduleTab.getTiTab());
	this.tabGroup.addTab(this.tabGroup.todoTab.getTiTab());
	this.tabGroup.addTab(this.tabGroup.boardTab.getTiTab());
	this.tabGroup.addTab(this.tabGroup.cabinetTab.getTiTab());
	this.tabGroup.addTab(this.tabGroup.otherTab.getTiTab());
};

module.exports = mainTabGroup;

mainTabGroup.prototype.open = function() {
	return this.tabGroup.open();
};

