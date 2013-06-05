var util = require('ui/util');
var styles = require('ui/handheld/boardListWindow/styles');

function boardListWindow(model, delegate) {
	this.__super__(styles.win, model, delegate);
	
	var win = this.win;
	
	// === Component ===============
	//self.svBoard = Ti.UI.createScrollView(styles.svBoard);
	win.tvBoard = Ti.UI.createTableView(styles.tvBoard);
	win.tvBoard.search = function(){
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
	//util.setViewRect(self.svBoard, 0, 0, '100%', '100%');
	util.setViewRect(win.tvBoard, 0, 0, '100%', '100%')
	
	// --- Add ---
	//self.add(self.svBoard);
	win.add(win.tvBoard);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/boardListWindow/logics'))(win, model, delegate);

	// -- Events From User ---
	win.addEventListener('open', function(e) { logics.winOpen(); });
	win.tvBoard.addEventListener('scroll', function(e) { logics.svBoardScroll(e); });
	win.tvBoard.addEventListener('touchend', function(e) { Ti.API.info(e.y); logics.tvBoardTouched(e); });
	win.tvBoard.addEventListener('click', function(e) { logics.clickList(e); });

	// --- Events From Model ---
	model.board.addEventListener('updateBoard', function(e) { logics.updateBoardList(e); });
	
};
module.exports = util.inherit(boardListWindow, require('ui/baseWindow'));

