var util = require('ui/util');
var styles = require('ui/handheld/todoListWindow/styles');

function todoListWindow(model, delegate) {
	this.__super__(styles.win, model, delegate);
	
	var win = this.window;
	
	// === Component ===============
	win.tvTodo = Ti.UI.createTableView(styles.tvTodo);
	
	// --- Layout ---
	util.setViewRect(win.tvTodo, 0, 0, '100%', '100%');
	
	// --- Add ---
	win.add(win.tvTodo);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/todoListWindow/logics'))(win, model, delegate);

	// -- Events From User ---
	win.addEventListener('open', function(e) { logics.winOpen(); });
	win.tvTodo.addEventListener('click', function(e) { logics.clickList(e); });

	// --- Events From Model ---
	model.cabinet.addEventListener('updateTodo', function(e) { logics.updateTodoList(e); });
	
};
module.exports = util.inherit(todoListWindow, require('ui/baseWindow'));

