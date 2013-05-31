var util = require('ui/util');

function logics(win, model, delegate) {
	this.win = win;
	this.model = model;
	this.delegate = delegate;
	this.offset = 0;
	this.bottomOfScreenOffset = ((100*20)-Ti.Platform.displayCaps.platformHeight);;
	this.lastRowOffset =this.bottomOfScreenOffset-100;
};

logics.prototype.winOpen = function(e) {
	var self = this;
	self.updateBoardList(self.model.board.getBoardList());
	self.delegate.fireEvent('openBoard');
};

logics.prototype.updateBoardList = function(param) {
	var self = this;

	var data = self.model.board.getBoardList();
	var rowData = [];
	// rowData = [
		// {title:"Refresh",color:'#000',height:50},
		// {title:"Row 1",color:'#000',height:50},
		// {title:"Row 2",color:'#000',height:50},
		// {title:"Row 3",color:'#000',height:50},
		// {title:"Row 4",color:'#000',height:50},
		// {title:"Row 5",color:'#000',height:50},
		// {title:"Row 6",color:'#000',height:50},
		// {title:"Row 7",color:'#000',height:50},
		// {title:"Row 8",color:'#000',height:50},
		// {title:"Row 9",color:'#000',height:t50},
		// {title:"Row 10",color:'#000',height:50},
		// {title:"Row 11",color:'#000',height:50},
		// {title:"Row 12",color:'#000',height:50},
		// {title:"Row 13",color:'#000',height:50},
		// {title:"Row 14",color:'#000',height:50},
		// {title:"Row 15",color:'#000',height:50},
		// {title:"Row 16",color:'#000',height:50},
		// {title:"Row 17",color:'#000',height:50},
		// {title:"Row 18",color:'#000',height:50},
		// {title:"Load More",color:'#000',height:50}
	// ];
	
	
	rowData.push(Ti.UI.createTableViewRow({
		title:"Refresh",color:'#f00',height:50
	}));
	for (var i in data) {
		var styles = require('ui/handheld/boardListWindow/styles');

		// TODO getti 行はクラス的にバインド関数を作る
		var row = Ti.UI.createTableViewRow(styles.tvrBoard);
		
		// コンポーネント
		//row.img = Ti.UI.createView(styles.viewImg);
		row.title = Ti.UI.createLabel(styles.lblTitle);
		row.summary = Ti.UI.createLabel(styles.lblSummary);
		row.authorName = Ti.UI.createLabel(styles.lblAuthorName);
		row.updateDate = Ti.UI.createLabel(styles.lblUpdateDate)

		// レイアウト
		//util.setViewRect(row.img, 10, 5, 50, 50);
		util.setViewRect(row.title, 70, 5, '100%', 30);
		util.setViewRect(row.summary, 70, 35, '100%', 20);
		util.setViewRect(row.authorName, 70, 57, '100%', 20);
		util.setViewRect(row.updateDate, 70, 79, '100%', 20);
		
		//row.add(row.img);
		row.add(row.title);
		row.add(row.summary);
		row.add(row.authorName);
		row.add(row.updateDate);
		
		// データ設定
		row.data = data[i];
		row.title.text = data[i].title;
		row.summary.text = data[i].body;
		row.authorName.text = data[i].author;
		row.updateDate.text = data[i].createDate;

		rowData.push(row);
	}
	
	self.win.tvBoard.data = rowData;
	if(rowData.length > 0) self.win.tvBoard.scrollToIndex(1);
};

logics.prototype.svBoardScroll = function(e) {
	var self = this;
	if (e.y != null) {
		self.offset = e.y;
		
		Ti.API.info('offset: '+ self.offset);
	}
};

logics.prototype.tvBoardTouched = function(e) {
	var self = this;
	var alertDialog = Titanium.UI.createAlertDialog({
		title: 'System Message',
		buttonNames: ['OK']
	});
	
	if (self.offset <= 0) {
		Ti.API.info('REFRESH !!!!');
		alertDialog.message = "REFRESH !!!!";
		//alertDialog.show();
		//self.win.svBoard.scrollTo(0, 50);
		self.win.tvBoard.scrollToIndex(1);
	} else if (self.offset < 50) {
		//self.win.svBoard.scrollTo(0, 50);
		self.win.tvBoard.scrollToIndex(1);
		Ti.API.info('Dont refresh, go back to base');
	// } else if (self.offset==self.bottomOfScreenOffset) {
		// Ti.API.info('LOAD MORE !!!!');
		// alertDialog.message = "LOAD MORE !!!!";
		// alertDialog.show();
		// self.win.svBoard.scrollTo(0,lastRowOffset);
	// } else if (self.offset > self.lastRowOffset) {
		// self.win.svBoard.scrollTo(0,lastRowOffset);
		// Ti.API.info('Dont load more, go back to base');
	}
};

logics.prototype.clickList = function(e) {
	var self = this;
	var detailWindow = new (require('ui/handheld/boardDetailWindow/view'))(self.model, self.delegate);
	detailWindow.update(e.row.data.groupId, e.row.data.id);
	detailWindow.open({}, self.win);
};

module.exports = logics;
