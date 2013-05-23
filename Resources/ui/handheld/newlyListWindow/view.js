function newlyListWindow(mdlNewly) {
	// require
	var util = require('ui/util');
	var styles = require('ui/handheld/newlyListWindow/styles');

	// MainWindow
	var self = Ti.UI.createWindow(styles.win);
	
	// コンポーネント郡
	self.tvNewly = Ti.UI.createTableView(styles.tvNewly);
	self.btnClose = Ti.UI.createButton(styles.btnClose);
	
	// レイアウト
	util.setViewRect(self.tvNewly, 0, 0, '100%', '90%');
	util.setViewRect(self.btnClose, 0, '90%', '100%', '10%');
	
	// コンポーネント追加
	self.add(self.tvNewly);
	self.add(self.btnClose);
	
	// イベント処理
	self.addEventListener('open', function() {
		mdlNewly.updateNewlyList();
	});
	
	self.tvNewly.addEventListener('click', function(e) {
		Ti.API.info('table view row clicked - source ' + e.source + ' index:' + e.index);
		alert('index:' + e.index);
	});
	
	self.btnClose.addEventListener('click', function(e) {
		self.close();
	});
	
	// モデルからのイベント通知
	mdlNewly.addEventListener('updateNewlyList', function(result) {
		if(result.success) {
			var rowData = [];
			var entry = result.data.entry;
			var size = entry.length;
			for (var i = 0; i < size; i++)
			{
				// TODO getti 行はクラス的にバインド関数を作る
				var row = Ti.UI.createTableViewRow(styles.tvrNewly);

				// コンポーネント
				row.img = Ti.UI.createView(styles.viewImg);
				row.title = Ti.UI.createLabel(styles.lblTitle);
				row.summary = Ti.UI.createLabel(styles.lblSummary);
				row.authorName = Ti.UI.createLabel(styles.lblAuthorName);
				row.updateDate = Ti.UI.createLabel(styles.lblUpdateDate)

				// レイアウト
				util.setViewRect(row.img, 10, 5, 50, 50);
				util.setViewRect(row.title, 70, 5, '100%', 30);
				util.setViewRect(row.summary, 70, 35, '100%', 20);
				util.setViewRect(row.authorName, 70, 57, '100%', 20);
				util.setViewRect(row.updateDate, 70, 79, '100%', 20);
				
				row.add(row.img);
				row.add(row.title);
				row.add(row.summary);
				row.add(row.authorName);
				row.add(row.updateDate);
				
				// データ設定
				row.title.text = entry[i].title;
				row.summary.text = entry[i].summary.text;
				row.authorName.text = (entry[i].author)?entry[i].author.name:'';
				row.updateDate.text = entry[i].updated

				rowData.push(row);
			}
			self.tvNewly.data = rowData;
		}
	});
	
	return self;
};

module.exports = newlyListWindow;
