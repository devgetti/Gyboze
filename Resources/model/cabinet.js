var util = require('model/util');

function cabinet(db, cyboze) {
	this.db = db;
	this.cyboze = cyboze;
	this.listeners = {};
	this.tblCabinet = new (require('model/db/dao/cabinet'))(db);
	this.tblCabinetFolder = new (require('model/db/dao/cabinetFolder'))(db);
};
cabinet.prototype = util.createObject(require('model/base'));

cabinet.prototype.fetchCabinet = function(groups) {
	var self = this;

	self.addEventListener('updateCabinetFolder', function(param) {
		var folders = self.getCabinetFolder(param.groupId);
		for(var i in folders) {
			self.fetchCabinetForGroupFolder(param.groupId, folders[i].id);
		}
	});
	
	self.fetchCabinetFolder(groups);
};

cabinet.prototype.fetchCabinetFolder = function(groups) {
	var self = this;
	
	for(var i in groups) {
		self.fetchCabinetFolderForGroup(groups[i].id);
	}
};

cabinet.prototype.fetchCabinetFolderForGroup = function(groupId) {
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
			
			// TODO トランザクションがうまいこといくなら、上のループでやってもいいのにね。
			self.db.open();
			self.db.begin();
			self.tblCabinetFolder.cmdInsert(data);
			self.db.commit();
			self.db.close();
			
			self.fireEvent('updateCabinetFolder', { groupId: groupId });
		}
	});
};

cabinet.prototype.fetchCabinetForGroupFolder = function(groupId, folderId) {
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
			// TODO 場合によっちゃループ外でやるひつようもある？
			self.db.open();
			self.db.begin();
			self.tblCabinet.cmdInsert(data);
			self.db.commit();
			self.db.close();
			
			self.fireEvent('updateCabinet', { groupId: groupId, folderId: folderId });
		}
	});
};


// === GETTER =======================


cabinet.prototype.getCabinet = function(groupId, folderId, id) {
	var self = this;
	var result = [];
	
	var param = {};
	if(groupId) param['groupId'] = groupId;
	if(folderId) param['folderId'] = folderId;
	if(id) param['id'] = id;
	
	self.db.open();
	result = self.tblCabinet.cmdSelectWithFetch(param, {'updateDate' : 'DESC'});
	self.db.close();
	return result;
};

cabinet.prototype.getCabinetFolder = function(groupId, id) {
	var self = this;
	var result = [];
	
	var param = {};
	if(groupId) param['groupId'] = groupId;
	if(id) param['id'] = id;
	
	self.db.open();
	result = self.tblCabinetFolder.cmdSelectWithFetch(param);
	self.db.close();
	return result;
};

module.exports = cabinet;
