var util = require('ui/util');
var styles = require('ui/handheld/boardDetailWindow/styles');

function boardDetailWindow(model, delegate) {
	this.__super__(styles.win, model, delegate);
	
	var win = this.window;
	
	// === Component ===============
	win.tvBoard = Ti.UI.createTableView(styles.tvBoard);
	
	win.tvrGroup = function() {
		var row = Ti.UI.createTableViewRow(styles.tvrGroup);
		row.lblItem = Ti.UI.createLabel(styles.tvrGroup.lblItem);
		row.lblValue = Ti.UI.createLabel(styles.tvrGroup.lblValue);
		util.setViewRect(row.lblItem, 7, 9, 'auto', 20);
		util.setViewRect(row.lblValue, 80, 9, 'auto', 20);
		row.add(row.lblItem);
		row.add(row.lblValue);
		return row;
	}();
	
	win.tvrTitle = function() {
		var row = Ti.UI.createTableViewRow(styles.tvrTitle);
		row.lblItem = Ti.UI.createLabel(styles.tvrTitle.lblItem);
		row.lblValue = Ti.UI.createLabel(styles.tvrTitle.lblValue);
		util.setViewRect(row.lblItem, 7, 9, 'auto', 20);
		util.setViewRect(row.lblValue, 80, 9, 'auto', 20);
		row.add(row.lblItem);
		row.add(row.lblValue);
		return row;
	}();
	
	win.tvrUpdateDate = function() {
		var row = Ti.UI.createTableViewRow(styles.tvrUpdateDate);
		row.lblItem = Ti.UI.createLabel(styles.tvrUpdateDate.lblItem);
		row.lblValue = Ti.UI.createLabel(styles.tvrUpdateDate.lblValue);
		util.setViewRect(row.lblItem, 7, 9, 'auto', 20);
		util.setViewRect(row.lblValue, 80, 9, 'auto', 20);
		row.add(row.lblItem);
		row.add(row.lblValue);
		return row;
	}();
	
	win.tvrBody = function() {
		var row = Ti.UI.createTableViewRow(styles.tvrBody);
		row.wbvValue = Ti.UI.createWebView(styles.wbvValue);
	//	util.setViewSize(row, '100%', 250)
	//	util.setViewRect(row.wbvValue, 0, 0, '100%', 250);
		row.add(row.wbvValue);
		return row;
	}();

	win.tvrComment = [];
	
	win.tvBoard.setData([win.tvrGroup, win.tvrTitle, win.tvrUpdateDate, win.tvrBody], {
		animationStyle : Titanium.UI.iPhone.RowAnimationStyle.FADE
	});
		
	// --- Layout ---
	util.setViewRect(win.tvBoard, 0, 0, '100%', 'auto');
	
	// --- Add Component ---
	win.add(win.tvBoard);
	
	// === Logics ====================
	var logics = new (require('ui/handheld/boardDetailWindow/logics'))(win, model, delegate);

	// -- Methods ---
	this.update = function(groupId, boardId) { logics.updateBoardDetail(groupId, boardId); };

	// -- Events From User ---
	win.addEventListener('open', function(e) { logics.winOpen(e); });

	// --- Events From Model ---
	
	
};
module.exports = util.inherit(boardDetailWindow, require('ui/baseWindow'));

