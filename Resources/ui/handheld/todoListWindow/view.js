var util = require('ui/util');

function todoListWindow(model, delegate) {
	var styles = require('ui/handheld/todoListWindow/styles');
	var self = Ti.UI.createWindow(styles.win);
	
	// === Component ===============
	self.tvTodo = Ti.UI.createTableView(styles.tvTodo);
	
	// --- Layout ---
	util.setViewRect(self.tvTodo, 0, 0, '100%', '100%');
	
	// --- Add ---
	self.add(self.tvTodo);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/todoListWindow/logics'))(self, model, delegate);

	// -- Events From User ---
	self.addEventListener('open', function(e) { logics.winOpen(); });
	self.tvTodo.addEventListener('click', function(e) { logics.clickList(e); });

	// --- Events From Model ---
	//model.todo.addEventListener('updateGroupInfo', function(result) { logics.updateGroupInfo(result); });	
	
	return self;
};

module.exports = todoListWindow;
