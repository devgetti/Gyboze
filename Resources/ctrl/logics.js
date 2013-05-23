function logics(model, view, ctrl) {
	this.model = model;
	this.view = view;
	this.ctrl = ctrl;
	this.callbackArray = [];
};

logics.prototype.loginCyboze = function(param) {
	var self = this;
	var arr = this.callbackArray;
	arr.push(param.callback);
	this.callbackArray = arr;
	self.view.loginWindow.open();
};

logics.prototype.loginLogic = function(param) {
	var self = this;
	self.view.loginWindow.close();
	var arr = this.callbackArray;
	var callback = arr.pop();
	this.callbackArray = arr;
	callback();
};
	
// TODO 名前かえる fetch->sync
logics.prototype.fetchData = function() {
	var self = this;
	self.ctrl.indicator.show();
	 
	// TODO バッチ実行的な仕組みを考えなきゃならない
	self.model.group.fetchGroup(function(result) {
		if(result.success) {
			// グループ取得後
			var groups = self.model.group.getGroups();
			
			var async = require('lib/async');
			var tasks = [];
			tasks.push(function(next) { self.model.schedule.syncSchedule(function() { Ti.API.info('end1'); next(null, true); }); });
			tasks.push(function(next) { self.model.todo.syncTodo(groups, function() { Ti.API.info('end2'); next(null, true); }); });
			//tasks.push(function(next) { self.model.todo.fetchTodoCategory(groups, function() { Ti.API.info('end3'); next(null, true); }); });
			//tasks.push(function(next) { self.model.board.fetchBoardCategory(groups, function() { Ti.API.info('end4'); next(null, true); }); });
			//	tasks.push(function(next) { self.model.board.fetchBoard(groups, function() { Ti.API.info('end5'); next(null, true); }); });
			//tasks.push(function(next) { self.model.cabinet.fetchCabinet(groups, function() { Ti.API.info('end6'); next(null, true); }); });
			
			async.series(tasks, function(err, results) {
				Ti.API.info('true end');
				Ti.API.info(results);
			});
			
			//alert('全部とるまでの同期方法を考えなきゃならなん。あと、パーサを最適化しないとメモリ不足で死ぬる。')
		} else {
			// グループ取得失敗
		}
	});
};

module.exports = logics;
