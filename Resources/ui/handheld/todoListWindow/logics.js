var util = require('ui/util');

function logics(win, model, delegate) {
	this.win = win;
	this.model = model;
	this.delegate = delegate;
}

logics.prototype.winOpen = function(e) {
	var self = this;
	self.updateTodoList(self.model.todo.getTodo());
};

logics.prototype.clickList = function(e) {
	var self = this;
	Ti.API.info('table view row clicked - index:' + e.index);
	alert('index:' + e.index);
	
	// var detailWindow = new (require('ui/handheld/boardDetailWindow/view'))(self.model, self.delegate);
	// detailWindow.setBoard(e.rowData.bindData);
	// detailWindow.open();
};

logics.prototype.updateGroupInfo = function(result) {

};

logics.prototype.updateTodoList = function(data) {
	var self = this;
	var rowData = [];
		
	for (var i in data) {
		var styles = require('ui/handheld/todoListWindow/styles');

		// TODO getti 行はクラス的にバインド関数を作る
		var row = Ti.UI.createTableViewRow(styles.tvrTodo);
		
		// コンポーネント
		//row.img = Ti.UI.createView(styles.viewImg);
		row.title = Ti.UI.createLabel(styles.lblTitle);
		row.desc = Ti.UI.createLabel(styles.lblDesc);
		row.authorName = Ti.UI.createLabel(styles.lblAuthorName);
		row.updateDate = Ti.UI.createLabel(styles.lblUpdateDate)

		// レイアウト
		//util.setViewRect(row.img, 10, 5, 50, 50);
		util.setViewRect(row.title, 70, 5, '100%', 30);
		util.setViewRect(row.desc, 70, 35, '100%', 20);
		util.setViewRect(row.authorName, 70, 57, '100%', 20);
		util.setViewRect(row.updateDate, 70, 79, '100%', 20);
		
		//row.add(row.img);
		row.add(row.title);
		row.add(row.desc);
		row.add(row.authorName);
		row.add(row.updateDate);
		
		// データ設定
		row.bindData = data[i];
		row.title.text = data[i].title;
		row.desc.text = data[i].body;
		row.authorName.text = data[i].author;
		row.updateDate.text = data[i].updateDate

		rowData.push(row);
	}
	
	self.win.tvTodo.data = rowData;
};

module.exports = logics;
