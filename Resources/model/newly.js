var util = require('model/util');

function newly(db, cyboze) {
	this.__super__();
	this.db = db;
	this.cyboze = cyboze;
	this.listeners = {};
};
module.exports = util.inherit(newly, require('model/base'));

// === GETTER =======================

newly.prototype.getNewlyList = function(groupId, id) {
	var self = this;
	var result = [];
	
	var param = {};
	if(groupId) param['groupId'] = groupId;
	if(id) param['id'] = id;
	
	self.db.open();
	result = self.db.table.newly.cmdSelectForList(param, 10);
	self.db.close();
	return result;
};

newly.prototype.chkNewly = function() {
	var self = this;

	var param = {
		// オプションパラメータ
		//'start-index': '0',			// コレクションを取得する場合のインデクスを指定します。値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',			// コレクションを取得する場合の最大件数を指定します。値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
		'unconfirmed': 'true',			// 未確認の新着情報のみ取得する場合に使います。値は “true” のみ可能です。
		'include-rule-out': 'true',		// 個人設定の参加グループで「通知しない」設定をしたグループの新着情報を含める場合に使います。値は “true” のみ可能です。
		//category: ''					// サイボウズLive内のアプリケーションを絞り込む場合に使います。ひとつだけ指定できます。
		//group: ''						// グループの ID を指定します
	};
	
	self.cyboze.selectNewly(param, function(result) {
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
				
				// カテゴリを
				entry[ind].category
				
				var row = {
					// category:
					// categoryId: idObj['GROUP'],
					// id: idObj['BOARD'],
					// title: entry[ind].title || '',
					// body: body['text'] || '',
					// link_pc: links['alternate'] || '',
					// link_mobile: links['mobile'] || '',
					// updateDate: entry[ind].updated || '',
					// author: entry[ind].author.name || ''
				};
				data.push(row);
			}
			
			// TODO ほんとは全部のグループが取り終わったら投げたい。
			self.fireEvent('existsNewly');
		}
	});
};

