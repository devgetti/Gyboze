var util = require('model/util');

function todo(db, cyboze) {
	this.db = db;
	this.cyboze = cyboze;
	this.listeners = {};
};
todo.prototype = util.createObject(require('model/base'));

// === GETTER =======================
todo.prototype.getTodo = function(groupId, id) {
	var self = this;
	var result = [];
	
	var param = {};
	if(groupId) param['groupId'] = groupId;
	if(id) param['id'] = id;
	
	self.db.open();
	result = self.db.table.todo.cmdSelectWithFetch(param, {'updateDate' : 'DESC'});
	self.db.close();
	return result;
};

todo.prototype.getTodoCategory = function(groupId, id) {
	var self = this;
	var result = [];
	
	var param = {};
	if(groupId) param['groupId'] = groupId;
	if(id) param['id'] = id;
	
	self.db.open();
	result = self.db.table.todoCategory.cmdSelectWithFetch(param);
	self.db.close();
	return result;
};

// === SYNC CYBOZE DATA =======================
todo.prototype.fetchTodo = function(groups, callback) {
	var self = this;
	var results;
	
	// Delete DB Data
	self.db.open();
	self.db.table.todo.cmdDelete();
	self.db.commit();
	self.db.close();
	
	// Sync All Group
	var async = require('lib/async');
	Ti.API.debug('=== Sync todo start ===' + group.id);
	async.mapSeries(groups, function(group, next) {
		Ti.API.debug('--- Sync todo start groupId:' + group.id);
		self.fetchTodoForGroup(group.id, function(result) {
			Ti.API.info('--- Sync todo end groupId:' + group.id);
			next(null, true);
		});
	},
	function(err, results) {
		Ti.API.info('=== Sync todo end ===');
	});
	if(callback) callback();
};

todo.prototype.syncTodoForGroup = function(groupId, callback) {
	var self = this;

	var param = {
		// 必須
		'group': groupId,			//  グループの ID を指定します。
		// オプションパラメータ
		//'term-start': '',		// タスク期日の最小値を指定します。指定しない場合はリクエストを処理する日時になります。
								// term-start と term-end を共に指定しなかった場合は、すべてのタスクを取得します。
		//'term-end': '',			// タスク期日の最大値を指定します。指定しない場合は term-start から1ヶ月後になります。
								// term-start と term-end は共に 1900年1月1日から 2100年12月31日の間でなければなりません。
								// term-end は term-start より未来の日付でなければなりません。
								// term-end を term-start より365日より未来の日付にすることはできません。
								// フォーマットは RFC 3339 の日時表現でなければなりません。
								// タイムゾーンは標準時 Z のみをサポートしています。
		//'embed-comment': '',	// “true” の場合にコメントも取得します。コメントへのアクセス権が必要です。
		//'start-index': '',		// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '',		// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
		//'status': '',			// タスクの状態を指定します。完了していない状態を表す “NOT_COMPLETED” のみ指定可能です。
		//'task-folder': '',		// 絞り込むカテゴリを指定します。値はID文字列を指定します。 “UNCLASSIFIED” を指定すると、未分類のタスクのみを取得できます。''					// グループの ID を指定します。
	};
	
	self.cyboze.selectTodo(param, function(result) {
		if(result.success) {
			// 取ってきたデータをDBに保存
			var data = [];
			// TODO 複数の場合と単数の場合のロジック同じにするようにパーサも考えなきゃならん
			var entry = function() {
				var arr = [];
				if(result.data.entry) {
					if(Array.isArray(result.data.entry) && result.data.entry.length > 0) {
						arr = result.data.entry;
					} else {
						arr.push(result.data.entry);
					}
				}
				return arr;
			}();
			for(var ind in entry){
				var idObj = util.feedId2obj(entry[ind].id, entry[ind].category);
				var links = util.feedItem2obj(entry[ind].link, 'rel', 'href');
				var body = util.feedItem2obj(entry[ind].summary, 'type', '#text');
				var status = entry[ind]['cbl:task']['valueString'];
				var priority = entry[ind]['cblTsk:priority'];
				
				var row = {
					groupId: idObj['GROUP'],
					id: idObj['TASK'],
					title: entry[ind].title,
					body: body['text'],
					status: status,
					priority: priority,
					link_pc: links['alternate'],
					link_mobile: links['mobile'],
					updateDate: entry[ind].updated,
					author: entry[ind].author.name || ''
				};
				data.push(row);
			}
			
			// TODO トランザクションがうまいこといくなら、上のループでやってもいいのにね。
			self.db.open();
			self.db.begin();
			self.db.table.todo.cmdInsert(data);
			self.db.commit();
			self.db.close();
			
			self.fireEvent('updateTodo', { groupId: groupId });
		}
		if(callback) callback(result);
	});
};

todo.prototype.fetchTodoCategory = function(groups, callback) {
	var self = this;
	var async = require('lib/async');
	async.each(groups, function(group, next) { 
		Ti.API.info('fetchTodoCategory each:' + group.id);
		self.fetchTodoCategoryForGroup(group.id, function() {
			Ti.API.info('fetchTodoCategory end' + group.id); next(null, true);
		});
	},
	function(err, results) {
		Ti.API.info('fetchTodoCategory kore end');
		Ti.API.info(results);
	});
};

todo.prototype.fetchTodoCategoryForGroup = function(groupId, callback) {
	var self = this;
	
	var param = {
		// 必須
		'group': groupId,			// グループの ID を指定します。
		// オプション
		'start-index': '0',			// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		'max-results': '100',		// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
	};
	
	self.cyboze.selectTodoCategory(param, function(result) {
		if(result.success) {
			// 取ってきたデータをDBに保存
			var data = [];
			// TODO 複数の場合と単数の場合のロジック同じにするようにパーサも考えなきゃならん
			var entry = function() {
				var arr = [];
				if(result.data.entry) {
					if(Array.isArray(result.data.entry) && result.data.entry.length > 0) {
						arr = result.data.entry;
					} else {
						arr.push(result.data.entry);
					}
				}
				return arr;
			}();
			
			for(var ind in entry){
				var row = {
					groupId: groupId,
					id: entry[ind].id,
					name: entry[ind].title || '',
					author: entry[ind].author.name || ''
				};
				data.push(row)
			}
			// TODO トランザクションがうまいこといくなら、上のループでやってもいいのにね。
			self.db.open();
			self.db.begin();
			self.db.table.todoCategory.cmdDelete();
			self.db.table.todoCategory.cmdInsert(data);
			self.db.commit();
			self.db.close();
			
			self.fireEvent('updateTodoCategory', { groupId: groupId });
		}
		if(callback) callback(result);
	});
};

module.exports = todo;
