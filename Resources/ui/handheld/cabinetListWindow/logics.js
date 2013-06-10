var util = require('ui/util');
var styles = require('ui/handheld/cabinetListWindow/styles');

exports.winOpen = function(e) {
	var self = this;
	self.updateCabinetList(self.model.cabinet.getCabinet());
	self.delegate.fireEvent('openBoard');
};

exports.listClick = function(e) {
	var self = this;
	Ti.API.info('table view row clicked - index:' + e.index);
	alert('index:' + e.index);
};

exports.updateCabinetList = function(e) {
	var self = this;

	var rowData = [];
	var groups = self.model.group.getGroups();
	for(var i in groups) {
		var folders = self.model.cabinet.getCabinetFolder(groups[i].id);
		for(var j in folders) {
			var headTitle = groups[i].title + "_" + folders[j].name;
			rowData.push(Ti.UI.createTableViewRow({ header: headTitle, height:'1' }));
			var data = self.model.cabinet.getCabinet(groups[i].id, folders[j].id);
			
			for (var k in data) {
				var row = Ti.UI.createTableViewRow(styles.tvrCabinet);
				
				// コンポーネント
				//row.img = Ti.UI.createView(styles.viewImg);
				row.name = Ti.UI.createLabel(styles.lblTitle);
				row.desc = Ti.UI.createLabel(styles.lblDesc);
				row.authorName = Ti.UI.createLabel(styles.lblAuthorName);
				row.updateDate = Ti.UI.createLabel(styles.lblUpdateDate);
		
				// レイアウト
				//util.setViewRect(row.img, 10, 5, 50, 50);
				util.setViewRect(row.name, 70, 5, '100%', 30);
				util.setViewRect(row.desc, 70, 35, '100%', 20);
				util.setViewRect(row.authorName, 70, 57, '100%', 20);
				util.setViewRect(row.updateDate, 70, 79, '100%', 20);
				
				//row.add(row.img);
				row.add(row.name);
				row.add(row.desc);
				row.add(row.authorName);
				row.add(row.updateDate);
				
				// データ設定
				row.bindData = data[k];
				row.title = data[k].title; // For Search
				row.name.text = data[k].title;
				row.desc.text = data[k].desc;
				row.authorName.text = data[k].author;
				row.updateDate.text = data[k].updateDate
		
				rowData.push(row);
			}
		}
	}
	
	self.win.tvCabinet.data = rowData;
};
