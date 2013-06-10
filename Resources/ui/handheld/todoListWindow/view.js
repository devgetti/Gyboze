var util = require('ui/util');
var styles = require('ui/handheld/todoListWindow/styles');
var logics = require('ui/handheld/todoListWindow/logics');

function todoListWindow(model, delegate, parent) {
	this.__super__(styles.win, model, delegate, parent);
	var self = this;
	var win = this.win;
	
	// === Component ===============
	win.tvTodo = Ti.UI.createTableView(styles.tvTodo);
	win.tvTodo.search = function(){
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
	util.setViewRect(win.tvTodo, 0, 0, '100%', '100%');
	
	// --- Add ---
	win.add(win.tvTodo);
	
	// === Logics ====================
	// -- Events From User ---
	win.addEventListener('open', function(e) { self.winOpen(); });
	win.tvTodo.addEventListener('click', function(e) { self.clickList(e); });

	// --- Events From Model ---
	model.cabinet.addEventListener('updateTodo', function(e) { self.updateTodoList(e); });
	
};
module.exports = util.inherit(todoListWindow, require('ui/baseWindow'));
util.expandFnc(todoListWindow, logics);
