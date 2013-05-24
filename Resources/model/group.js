var util = require('model/util');

function group(db, cyboze) {
	this.__super__();
	this.db = db;
	this.cyboze = cyboze;
	this.listeners = {};
};
module.exports = util.inherit(group, require('model/base'));

// === GETTER =======================
group.prototype.getGroups = function(id) {
	var self = this;
	var result = [];
	
	var param = {};
	if(id) param['id'] = id;
	
	result = self.db.table.group.cmdSelectWithFetch(param);
	return result;
};

// === SYNC CYBOZE DATA =======================
group.prototype.syncGroup = function(callback) {
	var self = this;
	
	self.db.table.group.cmdDelete();
	
	var param = param || {
		// オプション
		'start-index': '0',		// コレクションを取得する場合のインデクスを指定します。値は正数のみ可能です。デフォルトは “0” です。
		'max-results': '100',	// コレクションを取得する場合の最大件数を指定します。値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
	};
	self.cyboze.selectGroup(param, function(result) {
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
				var desc = util.feedItem2obj(entry[ind].summary, 'type', '#text');
				
				var row = {
					id: idObj['GROUP'],
					title: entry[ind].title || '',
					desc: desc['text'] || '',
					link_pc: links['alternate'] || '',
					link_mobile: links['mobile'] || '',
					createDate: entry[ind].updated || '',
					author: entry[ind].author.name || ''
				};
				
				// var iconParam = {
					// // 必須パラメータ
					// 'type': 'group',			// 取得したいアイコンの種別を指定します。 “group” または “user”
					// 'group': idObj['GROUP'],	// アイコンを取得したいグループの ID を指定します。（ type が “group” のとき）
					// //'user': '',				// アイコンを取得したいユーザーの ID を指定します。（ type が “user” のとき）
					// // オプションパラメータ
					// //'group': ''				// グループでのアイコンを取得したい場合のグループの ID を指定します。（ type が “user” のとき）
				// };
				// self.cyboze.selectIcon(iconParam, function(iconResult) {
					// if(iconResult.success) {
// 						
					// } else {
// 						
					// }
				// });
				
				data.push(row);
			}
			
			self.db.table.group.cmdInsert(data);
			self.fireEvent('updateGroup', {});
		}
		if(callback) callback(result);
	});
};
