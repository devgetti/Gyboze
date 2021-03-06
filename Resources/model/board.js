var util = require('model/util');

function board(db, cyboze) {
	this.__super__();
	this.db = db;
	this.cyboze = cyboze;
	this.listeners = {};
};
module.exports = util.inherit(board, require('model/base'));

// === GETTER =======================
board.prototype.getBoardList = function(groupId, id) {
	var self = this;
	var result = [];
	
	var param = {};
	if(groupId) param['groupId'] = groupId;
	if(id) param['id'] = id;
	
	result = self.db.table.board.cmdSelectForList(param, 10);
	return result;
};

board.prototype.getBoardDetail = function(groupId, id) {
	var self = this;
	var result = [];
	
	var param = {};
	if(groupId) param['groupId'] = groupId;
	if(id) param['id'] = id;
	
	result = self.db.table.board.cmdSelectForDetail(param);

	return (result.length > 0)?result[0]:null;
};

board.prototype.getBoardCategory = function(groupId, id) {
	var self = this;
	var result = [];
	
	var param = {};
	if(groupId) param['groupId'] = groupId;
	if(id) param['id'] = id;
	
	self.self.db.table.boardCategory.cmdSelectWithFetch(param);
	return result;
};

// === SYNC CYBOZE DATA =======================
board.prototype.syncBoard = function(groups, callback) {
	var self = this;
	
	// Delete DB Data
	self.db.table.board.cmdDelete();
	
	// Sync All Group
	var async = require('lib/async');
	Ti.API.debug('=== Sync board start ===');
	async.mapSeries(groups, function(group, next) {
		Ti.API.debug('--- Sync board start groupId:' + group.id);
		self.syncBoardForGroup(group.id, function(result) {
			Ti.API.debug('--- Sync board end groupId:' + group.id);
			next(null, true);
		});
	},
	function(err, results) {
		Ti.API.debug('=== Sync board end ===');
		if(callback) callback();
	});
};

board.prototype.syncBoardForGroup = function(groupId, callback) {
	var self = this;

	var param = {
		// 必須
		'group': groupId,		// グループの ID を指定します。 (GET リクエストのとき)
		// オプション
		'embed-comment': 'false',	// “true” の場合にコメントも取得します。コメントへのアクセス権が必要です。
		'start-index': '0',			// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		'max-results': '10',		// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
		//'board-folder': 			// 絞り込むカテゴリを指定します。値はID文字列を指定します。 “UNCLASSIFIED” を指定すると、未分類のトピックのみを取得できます。
	};
	
	self.cyboze.selectBoard(param, function(result) {
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
				var editFlg = (entry[ind].cblBrd_allowEdit)?'1':'0';
				
				var row = {
					groupId: idObj['GROUP'],
					id: idObj['BOARD'],
					title: entry[ind].title || '',
					body: body['text'] || '',
					link_pc: links['alternate'] || '',
					link_mobile: links['mobile'] || '',
					createDate: entry[ind].updated || '',
					editFlg: editFlg || '0',
					author: entry[ind].author.name || ''
				};
				data.push(row);
			}
			
			self.db.table.board.cmdInsert(data);

			self.fireEvent('updateBoard', { groupId: groupId });
		}
		if(callback) callback(result);	
	});
};

board.prototype.syncBoardCategory = function(groups, callback) {
	var self = this;
	
	// Delete DB Data
	self.db.table.boardCategory.cmdDelete();
	
	// Sync All Group
	var async = require('lib/async');
	Ti.API.debug('=== Sync boardCategory start ===');
	async.mapSeries(groups, function(group, next) {
		Ti.API.debug('--- Sync boardCategory start groupId:' + group.id);
		self.syncBoardCategoryForGroup(group.id, function(result) {
			Ti.API.debug('--- Sync boardCategory end groupId:' + group.id);
			next(null, true);
		});
	},
	function(err, results) {
		Ti.API.debug('=== Sync boardCategory end ===');
		if(callback) callback();
	});
};

board.prototype.syncBoardCategoryForGroup = function(groupId, callback) {
	var self = this;
	
	var param = {
		// 必須
		'group': groupId,			// グループの ID を指定します。
		// オプション
		'start-index': '0',			// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		'max-results': '100',		// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
	};
	
	self.cyboze.selectBoardCategory(param, function(result) {
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

			self.db.table.boardCategory.cmdInsert(data);
			self.fireEvent('updateBoardCategory', { groupId: groupId });
		}
		if(callback) callback(result);
	});
};
