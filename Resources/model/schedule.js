var util = require('model/util');

function schedule(db, cyboze) {
	this.db = db;
	this.cyboze = cyboze;
	this.listeners = {};
};
schedule.prototype = util.createObject(require('model/base'));

// === GETTER =======================
schedule.prototype.getSchedule = function(groupId) {
	var self = this;
	var result = [];
	
	var param = {};
	if(groupId) param['groupId'] = groupId;
	
	self.db.open();
	result = self.db.table.schedule.cmdSelectWithFetch(param);
	self.db.close();
	return result;
};

// === SYNC CYBOZE DATA =======================
/**
 * 
 * @param {Object} callback
 */
schedule.prototype.syncSchedule = function(callback) {
	var self = this;
	
	var param = {
		// オプション
		// 'term-start': 				// イベントを取得する期間の最小値を指定します。指定しない場合はリクエストを処理する日時になります。
		// 'term-endv': 				// イベントを取得する期間の最大値を指定します。指定しない場合は term-start から1ヶ月後になります。
										// term-start と term-end は共に 1900年1月1日から 2100年12月31日の間でなければなりません。
										// term-end は term-start より未来の日付でなければなりません。
										// term-end を term-start より365日より未来の日付にすることはできません。
										// フォーマットは RFC 3339 の日時表現でなければなりません。
										// タイムゾーンは標準時 Z のみをサポートしています。
										// 日付範囲は次のように決定されます。
										// 予定の開始日時 <= term-start < 予定の終了日時
										// 予定の開始日時 < term-end < 予定の終了日時
		'embed-comment': 'false',		// “true” の場合にコメントも取得します。コメントへのアクセス権が必要です。
		'start-index': '0',				// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		'max-results': '10',			// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
		'ignore-aggregated': 'false'	// サイボウズLiveシンクで同期された予定を含めるかを指定します。デフォルトは “false” です。
	};
	
	self.cyboze.selectSchedule(param, function(result) {
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
				
				// TODO ぐぬぬ。。期間指定と繰り返し指定のデータがめんどすぐる。
				var startTime, endTime;
				// if(entry[ind]['cblSch:recurrence']) {
					// // 繰り返し予定の場合
					// starTime = entry[ind]['cblSch:recurrence'][]
				// }
				// とりあえず登録日時で勘弁
				startTime = entry[ind]['cbl:when']['startTime'];
				endTime = entry[ind]['cbl:when']['endTime'];
				var repeatFlg = (entry[ind]['cblSch:recurrence'])?'1':'0';
				
				var row = {
					id: (entry[ind]['cbl:group'])?idObj['GW_SCHEDULE']:idObj['MP_SCHEDULE'],
					groupId: (entry[ind]['cbl:group'])?idObj['GROUP']:'PERSONAL',
					title: entry[ind].title,
					desc: desc['text'],
					startTime: startTime,
					endTime: endTime,
					repeatFlg: repeatFlg,
					link_pc: links['alternate'],
					link_mobile: links['mobile'],
					author: entry[ind].author.name,
				};
				data.push(row);
			}
			
			// TODO トランザクションがうまいこといくなら、上のループでやってもいいのにね。
			self.db.open();
			self.db.begin();
			self.db.table.schedule.cmdDelete();
			self.db.table.schedule.cmdInsert(data);
			self.db.commit();
			self.db.close();
			self.fireEvent('updateSchedule');
		}
		if(callback) callback(result);
	});
};

module.exports = schedule;
