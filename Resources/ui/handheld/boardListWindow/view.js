var util = require('ui/util');

function boardListWindow(model, delegate) {
	var styles = require('ui/handheld/boardListWindow/styles');
	var self = Ti.UI.createWindow(styles.win);

	// === Component ===============
	//self.svBoard = Ti.UI.createScrollView(styles.svBoard);
	self.tvBoard = Ti.UI.createTableView(styles.tvBoard);
	
	// --- Layout ---
	//util.setViewRect(self.svBoard, 0, 0, '100%', '100%');
	util.setViewRect(self.tvBoard, 0, 0, '100%', '100%')
	
	// --- Add ---
	//self.add(self.svBoard);
	self.add(self.tvBoard);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/boardListWindow/logics'))(self, model, delegate);

	// -- Events From User ---
	self.addEventListener('open', function(e) { logics.winOpen(); });
	self.tvBoard.addEventListener('scroll', function(e) { logics.svBoardScroll(e); });
	self.tvBoard.addEventListener('touchend', function(e) {Ti.API.info(e.y); logics.tvBoardTouched(e); });
	self.tvBoard.addEventListener('click', function(e) { logics.clickList(e); });

	// --- Events From Model ---
	model.board.addEventListener('updateBoard', function(e) { logics.updateBoardList(e); });
	
	//return self;
	this.win = self;
};

boardListWindow.prototype.open = function(tab) {
	var self = this;
	
	if(tab) {
		tab.open(self.win);
		self.tab = tab;
	} else {
		self.win.open();
	}
};

boardListWindow.prototype.close = function(tab) {
	var self = this;
	//if(self.tab) {
		//if(iOS) 
		//self.tab.close(self.win)
	//} else {
		self.win.close();
	//}
};

boardListWindow.prototype.setTab = function() {
	return this.tab;
};

boardListWindow.prototype.getWindow = function() {
	return this.win;
};


module.exports = boardListWindow;
