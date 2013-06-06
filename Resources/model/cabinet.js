var util = require('model/util');

function cabinet(db, cyboze) {
	this.__super__();
	this.db = db;
	this.cyboze = cyboze;
	this.listeners = {};
};
module.exports = util.inherit(cabinet, require('model/base'));

// === GETTER =======================
cabinet.prototype.getCabinet = function(groupId, folderId, id) {
	var self = this;
	var result = [];
	
	var param = {};
	if(groupId) param['groupId'] = groupId;
	if(folderId) param['folderId'] = folderId;
	if(id) param['id'] = id;
	
	result = self.db.table.cabinet.cmdSelect(param, {'updateDate' : 'DESC'});
	return result;
};

cabinet.prototype.getCabinetFolder = function(groupId, id) {
	var self = this;
	var result = [];
	
	var param = {};
	if(groupId) param['groupId'] = groupId;
	if(id) param['id'] = id;
	
	result = self.db.table.cabinetFolder.cmdSelect(param);
	return result;
};

// === SYNC CYBOZE DATA =======================
cabinet.prototype.syncCabinet = function(groups, callback) {
	var self = this;
	
	// Delete DB Data
	self.db.table.cabinetFolder.cmdDelete();
	self.db.table.cabinet.cmdDelete();
	
	// Sync All Group
	var async = require('lib/async');
	Ti.API.debug('=== Sync cabinetFolder start ===');
	async.mapSeries(groups, function(group, next) {
		Ti.API.debug('--- Sync cabinetFolder start groupId:' + group.id);
		self.syncCabinetFolderForGroup(group.id, function(result) {
			Ti.API.debug('--- Sync cabinetFolder end groupId:' + group.id);
			
			var folders = self.getCabinetFolder(group.id);
			var asyncFolder = require('lib/async');
			Ti.API.debug('=== Sync cabinet start ===');
			asyncFolder.mapSeries(folders, function(folder, nextFolder) {
				Ti.API.debug('--- Sync cabinet start groupId:' + folder.groupId + " folderId:" + folder.id);
				self.syncCabinetForGroupFolder(folder.groupId, folder.id, function(result) {
					Ti.API.debug('--- Sync cabinet end groupId:' + folder.groupId + " folderId:" + folder.id);
					nextFolder(null, true);
				});
			},
			function(err, results) {
				Ti.API.debug('=== Sync cabinet end ===');
				next(null, true);
			});
		});
	},
	function(err, results) {
		Ti.API.debug('=== Sync cabinetFolder end ===');
		if(callback) callback();
	});
};

cabinet.prototype.syncCabinetFolderForGroup = function(groupId, callback) {
	var self = this;
	
	var param = {
		// 必須
		'group': groupId,	// グループの ID を指定します。
		// オプション
		'start-index': '0',		// コレクションを取得する場合のインデクスを指定します。値は正数のみ可能です。デフォルトは “0” です。
		'max-results': '100',	// コレクションを取得する場合の最大件数を指定します。値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。	}
	};
	
	self.cyboze.selectCabinetFolder(param, function(result) {
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
			
			// 未分類、添付、ゴミ箱を追加
			data.push({
				groupId: groupId,
				id: 'UNCLASSIFIED',
				name: '未分類',
				author: 'System'
			});
			data.push({
				groupId: groupId,
				id: 'ATTACH',
				name: '添付ファイル',
				author: 'System'
			});
			data.push({
				groupId: groupId,
				id: 'TRASH',
				name: 'ゴミ箱',
				author: 'System'
			});
			
			self.db.table.cabinetFolder.cmdInsert(data);
			self.fireEvent('updateCabinetFolder', { groupId: groupId });
		}
		if(callback) callback(result);
	});
};

cabinet.prototype.syncCabinetForGroupFolder = function(groupId, folderId, callback) {
	var self = this;

	var param = {
		// 必須
		'group': groupId,			// グループの ID を指定します。 (GET リクエストのとき)
		'cabinet-folder': folderId,	// 絞り込むフォルダを指定します。値はID文字列を指定するか、”UNCLASSIFIED” で未分類、”ATTACH” で添付、”TRASH” でゴミ箱を指定します。
		// オプション
		'start-index': '0',			// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		'max-results': '100',		// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
	};
			
	self.cyboze.selectCabinet(param, function(result) {
		if(result.success) {
			// 取ってきたデータをDBに保存
			var data = [];
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
				var desc = util.feedItem2obj(entry[ind].summary, 'type', '#text');
				var fileSize = (entry[ind]['cblCbnt:fileSize'])?parseInt(entry[ind]['cblCbnt:fileSize']):0;
				var fileVersion = (entry[ind]['cblCbnt:versionNumber'])?parseInt(entry[ind]['cblCbnt:versionNumber']):0;
				
				var row = {
					groupId: idObj['GROUP'],
					folderId: folderId,
					id: idObj['CABINET'],
					title: entry[ind]['title'] || '',
					desc: desc['text'] || '',
					fileName: entry[ind]['cblCbnt:fileName'] || '',
					fileSize: fileSize,
					fileVersion: fileVersion,
					link_pc: links['alternate'] || '',
					link_mobile: links['mobile'] || '',
					updateDate: entry[ind].updated || '',
					author: entry[ind].author.name || ''
				};
				data.push(row);
			}
			self.db.table.cabinet.cmdInsert(data);
			self.fireEvent('updateCabinet', { groupId: groupId, folderId: folderId });
		}
		if(callback) callback(result);
	});
};


