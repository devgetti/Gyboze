function logics(model, view, ctrl) {
	this.model = model;
	this.view = view;
	this.ctrl = ctrl;
	this.callbackArray = [];
};

logics.prototype.init = function() {
	var self = this;
	var version = Ti.App.getVersion();
	var current = Ti.App.Properties.getString('System.Version', 0);
	if (current <= 0) {
		// 初回起動時
		ctrl.db.createDB();
		
		// データ同期
		self.syncData();
	}
	if (current < version) {
		// バージョンアップ時
	}
	Ti.App.Properties.setString('System.Version', version);	// Version の値を CV としてしまう（次回に備える）
};

logics.prototype.login = function(param) {
	var self = this;
	
	self.view.loginWindow.open(param.callback);
	
	
//	self.view.tabGroup.open();
//	self.view.loginWindow.close();
};
	
logics.prototype.syncData = function() {
	var self = this;
	self.ctrl.indicator.show();
	
	self.model.group.syncGroup(function(result) {
		if(result.success) {
			// グループ取得後
			var groups = self.model.group.getGroups();
			
			var async = require('lib/async');
			var tasks = [];
			tasks.push(function(next) { self.model.schedule.syncSchedule(function() { Ti.API.info('end1'); next(null, true); }); });
			tasks.push(function(next) { self.model.todo.syncTodo(groups, function() { Ti.API.info('end2'); next(null, true); }); });
			tasks.push(function(next) { self.model.todo.syncTodoCategory(groups, function() { Ti.API.info('end3'); next(null, true); }); });
			tasks.push(function(next) { self.model.board.syncBoardCategory(groups, function() { Ti.API.info('end4'); next(null, true); }); });
			tasks.push(function(next) { self.model.board.syncBoard(groups, function() { Ti.API.info('end5'); next(null, true); }); });
			tasks.push(function(next) { self.model.cabinet.syncCabinet(groups, function() { Ti.API.info('end6'); next(null, true); }); });
			
			async.series(tasks, function(err, results) {
				Ti.API.info('true end');
				Ti.API.info(results);
				Ti.App.Properties.setString('System.LastSync', new Date());
				self.ctrl.indicator.hide();
			});
			
			//alert('全部とるまでの同期方法を考えなきゃならなん。あと、パーサを最適化しないとメモリ不足で死ぬる。')
		} else {
			// グループ取得失敗
		}
	});
};

module.exports = logics;
