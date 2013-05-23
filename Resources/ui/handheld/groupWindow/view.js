function groupWindow(model) {
	// require
	var util = require('ui/util');
	var styles = require('ui/handheld/groupWindow/styles');

	// MainWindow
	var win = Ti.UI.createWindow(styles.win);
	
	// コンポーネント郡
	win.tvGroup = Ti.UI.createTableView(styles.tvGroup);	
	
	// レイアウト
	util.setViewRect(win.tvGroup, 0, 0, '100%', '100%');
	
	// コンポーネント追加
	win.add(win.tvGroup);
	
	// データ設定
	var data = [];
	data[0] = {title:'グループ名', header:'Header 1'};
	data[1] = Ti.UI.createTableViewRow({title:'イベント',backgroundColor:'#900'});
	data[2] = Ti.UI.createTableViewRow({title:'TOOD' ,backgroundColor:'#fff'});
	data[3] = Ti.UI.createTableViewRow({title:'掲示板',backgroundColor:'#900'});
	data[4] = Ti.UI.createTableViewRow({title:'共有フォルダ',backgroundColor:'#fff'});
	data[5] = Ti.UI.createTableViewRow({title:'メンバー',backgroundColor:'#fff'});
	
	win.tvGroup.data = data;
	
	// モデルからのイベント通知
	model.addEventListener('selectGroup', function(data) {
		alert(data);
	
		// var inputData = [
			// {title:'row 1', header:'Header 1'},
			// {title:'row 2'},
			// {title:'row 3'},
			// {title:'row 4', header:'Header 2'},
			// {title:'row 5'}
		// ];
		// self.tabGroup.groupTab.window.tvGroup.data = inputData;
	});
	
	return win;
};

module.exports = groupWindow;
