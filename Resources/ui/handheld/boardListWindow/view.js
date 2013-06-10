var util = require('ui/util');
var styles = require('ui/handheld/boardListWindow/styles');
var logics = require('ui/handheld/boardListWindow/logics');

function boardListWindow(model, delegate, parent) {
	this.__super__(styles.win, model, delegate, parent);
	var self = this;
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
	// -- Events From User ---
	win.addEventListener('open', function(e) { self.winOpen(); });
	win.tvBoard.addEventListener('scroll', function(e) { self.svBoardScroll(e); });
	win.tvBoard.addEventListener('touchend', function(e) { Ti.API.info(e.y); self.tvBoardTouched(e); });
	win.tvBoard.addEventListener('click', function(e) { self.clickList(e); });

	// --- Events From Model ---
	model.board.addEventListener('updateBoard', function(e) { self.updateBoardList(e); });
	
	this.offset = 0;
	this.bottomOfScreenOffset = ((100*20)-Ti.Platform.displayCaps.platformHeight);;
	this.lastRowOffset =this.bottomOfScreenOffset-100;
};
module.exports = util.inherit(boardListWindow, require('ui/baseWindow'));
util.expandFnc(boardListWindow, logics);
