var base = require('lib/cybozelive');
var parser = new (require('lib/TiDomParser')).hamasyou.XML.TiDomParser();


var rewriteObj = function(src, dst) {
	var result = {};
	if(!src) {
		result = dst;
	} else {
		result = src;
		for(var key in dst) {
			result[key] = dst[key];
		}
	}
	return result;
};

/**
 * 
 * @param {Object} userId
 * @param {Object} passwd
 * @param {Object} callback
 */
base.Cyboze.prototype.xauthorize = function(userId, passwd, callback) {
	var self = this;
	if(this.authorized) {
		setTimeout(function() {
			callback({
				success: true,
				error: false,
				accessTokenKey: self.accessTokenKey,
				accessTokenSecret: self.accessTokenSecret
			});
		}, 1);
	} else {
		// xAuth
		this.oauthClient.post(self.xauthorizeUrl, {
			'x_auth_username': userId,
			'x_auth_password': passwd,
			'x_auth_mode': 'client_auth'
		}, function(data) {
			var token = self.oauthClient.parseTokenRequest(data);
			var tokenKey = token.oauth_token;
			var tokenSecret = token.oauth_token_secret;
			Ti.API.debug("Token Key:" + tokenKey + " Token Secret:" + tokenSecret);
			
			self.oauthClient.setAccessToken(tokenKey, tokenSecret);
			
			callback({
				success: true,
				error: false,
				userId: userId,
				accessTokenKey: tokenKey,
				accessTokenSecret: tokenSecret,
				response: data
			});
			self.authorized = true;
			
		}, function(data) {
			var code = data.source.status;
			Ti.API.debug("ResponseCode:" + code + "ResponseText:" + data.source.responseText);
			callback({
				success: false,
				error: true,
				response: data
			});
		});
	}
};

/**
 * 
 * @param {Object} url
 * @param {Object} param
 * @param {Object} method
 * @param {Object} callback
 */
base.Cyboze.prototype.select = function(url, param, method, callback) {
	var self = this;
	
	if(!self.authorized) {
		self.fireEvent('Unauthorized', { 
			callback: function() {
				 self.select(url, param, method, callback);
			}
		});
		return;
	}
	
	self.request(url, param, {}, method, function(data) {
		var result = {};

		if(data.success) {
			var xmlFeed = Ti.XML.parseString(data.result.text);
			var jsonFeed = parser.dom2Json(xmlFeed.getElementsByTagName('feed').item(0));
			result = { success: true, data: jsonFeed.feed };
			Ti.API.info(url + ":" + JSON.stringify(jsonFeed));
		} else {
			result = { success: false};
			
			var source = null;
			if(data.result) {
				if(data.result.source) {
					source = data.result.source;
				}
			} else {
				source = data.source;
			}
			if(source) {
				// ステータスコードで判定
				var code = source.status;
				if(code >= 400 && code < 500) {
					// 認証エラー
					self.fireEvent('AuthError', {});
				} else if(code >= 500) {
					// サーバエラー
					self.fireEvent('ServerError', {});
				} else {
					// 予期しないエラー
					self.fireEvent('UnexceptedError', {});
				}
			} else {
				// 予期しないエラー
				self.fireEvent('UnexceptedError', {});
			}
		}
		if(callback) callback(result);
	});
};

/**
 * 
 * @param {Object} param
 * @param {Object} callback
 */
base.Cyboze.prototype.selectGroup = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/group/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// オプションパラメータ
		//'start-index': '0',		// コレクションを取得する場合のインデクスを指定します。値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',		// コレクションを取得する場合の最大件数を指定します。値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
		//'group-folder': ''		// 絞り込むグループフォルダを指定します。値はID文字列を指定します。 “UNCLASSIFIED” を指定すると、グループフォルダに入っていないグループのみを取得できます。
	}, param);
	
	self.select(url, sendParam, method, callback);
};

/**
 * 
 * @param {Object} param
 * @param {Object} callback
 */
base.Cyboze.prototype.selectNewly = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/notification/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// オプションパラメータ
		//'start-index': '0',			// コレクションを取得する場合のインデクスを指定します。値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',			// コレクションを取得する場合の最大件数を指定します。値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
		//'unconfirmed': 'true',		// 未確認の新着情報のみ取得する場合に使います。値は “true” のみ可能です。
		//'include-rule-out': 'true',	// 個人設定の参加グループで「通知しない」設定をしたグループの新着情報を含める場合に使います。値は “true” のみ可能です。
		//category: ''					// サイボウズLive内のアプリケーションを絞り込む場合に使います。ひとつだけ指定できます。
		//group: ''						// グループの ID を指定します
	}, param);

	self.select(url, sendParam, method, callback);
};

/**
 * 
 * @param {Object} param
 * @param {Object} callback
 */
base.Cyboze.prototype.selectEvent = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/gwSchedule/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// 必須パラメータ
		'group': '',				// グループの ID を指定します。 (GET リクエストのとき)
		// オプションパラメータ
		//'embed-comment': 'true',	// “true” の場合にコメントも取得します。コメントへのアクセス権が必要です。
		//'start-index': '0',		// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',		// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
		//'event-folder': 			// 絞り込むカテゴリを指定します。値はID文字列を指定します。 “UNCLASSIFIED” を指定すると、未分類のトピックのみを取得できます。
	}, param);
	
	self.select(url, sendParam, method, callback);
};

/**
 * 
 * @param {Object} param
 * @param {Object} callback
 */
base.Cyboze.prototype.selectSchedule = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/schedule/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// オプションパラメータ
		//'term-start': '' 				// イベントを取得する期間の最小値を指定します。指定しない場合はリクエストを処理する日時になります。
		//'term-endv': ''				// イベントを取得する期間の最大値を指定します。指定しない場合は term-start から1ヶ月後になります。
										// term-start と term-end は共に 1900年1月1日から 2100年12月31日の間でなければなりません。
										// term-end は term-start より未来の日付でなければなりません。
										// term-end を term-start より365日より未来の日付にすることはできません。
										// フォーマットは RFC 3339 の日時表現でなければなりません。
										// タイムゾーンは標準時 Z のみをサポートしています。
										// 日付範囲は次のように決定されます。
										// 予定の開始日時 <= term-start < 予定の終了日時
										// 予定の開始日時 < term-end < 予定の終了日時
		//'embed-comment': 'true',		// “true” の場合にコメントも取得します。コメントへのアクセス権が必要です。
		//'start-index': '0',			// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',			// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
		//'ignore-aggregated': 'false'	// サイボウズLiveシンクで同期された予定を含めるかを指定します。デフォルトは “false” です。
	}, param);
		
	self.select(url, sendParam, method, callback);
};

/**
 * 
 * @param {Object} param
 * @param {Object} callback
 */
base.Cyboze.prototype.selectTodoPersonal = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/task/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// オプションパラメータ
		//'term-start': '',			// タスク期日の最小値を指定します。指定しない場合はリクエストを処理する日時になります。
									// 'term-start と term-end を共に指定しなかった場合は、すべてのタスクを取得します。
		//'term-end': '',			// タスク期日の最大値を指定します。指定しない場合は term-start から1ヶ月後になります。
									// 'term-start と term-end は共に 1900年1月1日から 2100年12月31日の間でなければなりません。
									// term-end は term-start より未来の日付でなければなりません。
									// term-end を term-start より365日より未来の日付にすることはできません。
									// フォーマットは RFC 3339 の日時表現でなければなりません。
									// タイムゾーンは標準時 Z のみをサポートしています。
		//'embed-comment': 'true',	// “true” の場合にコメントも取得します。コメントへのアクセス権が必要です。
		//'start-index': '0',		// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',		// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
		//'status': 'NOT_COMPLETED',// タスクの状態を指定します。完了していない状態を表す “NOT_COMPLETED” のみ指定可能です。
		//'group': ''					// グループの ID を指定します。
	}, param);
		
	self.select(url, sendParam, method, callback);
};

/**
 * 
 * @param {Object} param
 * @param {Object} callback
 */
base.Cyboze.prototype.selectTodo = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/gwTask/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// 必須パラメータ
		'group': '',					//  グループの ID を指定します。
		// オプションパラメータ
		//'term-start': '',				// タスク期日の最小値を指定します。指定しない場合はリクエストを処理する日時になります。
										// term-start と term-end を共に指定しなかった場合は、すべてのタスクを取得します。
		//'term-end': '',				// タスク期日の最大値を指定します。指定しない場合は term-start から1ヶ月後になります。
										// term-start と term-end は共に 1900年1月1日から 2100年12月31日の間でなければなりません。
										// term-end は term-start より未来の日付でなければなりません。
										// term-end を term-start より365日より未来の日付にすることはできません。
										// フォーマットは RFC 3339 の日時表現でなければなりません。
										// タイムゾーンは標準時 Z のみをサポートしています。
		//'embed-comment': 'true',		// “true” の場合にコメントも取得します。コメントへのアクセス権が必要です。
		//'start-index': '0',			// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',			// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
		//'status': 'NOT_COMPLETED',	// タスクの状態を指定します。完了していない状態を表す “NOT_COMPLETED” のみ指定可能です。
		//'task-folder': '',			// 絞り込むカテゴリを指定します。値はID文字列を指定します。 “UNCLASSIFIED” を指定すると、未分類のタスクのみを取得できます。''					// グループの ID を指定します。
	}, param);
		
	self.select(url, sendParam, method, callback);
};

/**
 * 
 * @param {Object} param
 * @param {Object} callback
 */
base.Cyboze.prototype.selectTodoCategory = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/gwTaskFolder/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// 必須パラメータ
		'group': '',				// グループの ID を指定します。
		// オプションパラメータ
		//'start-index': '0',		// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',		// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
	}, param);
	
	self.select(url, sendParam, method, callback);
};

/**
 * 
 * @param {Object} param
 * @param {Object} callback
 */
base.Cyboze.prototype.selectBoardCategory = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/boardFolder/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// 必須パラメータ
		'group': '',				// グループの ID を指定します。
		// オプションパラメータ
		//'start-index': '0',		// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',		// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
	}, param);
	
	self.select(url, sendParam, method, callback);
};

/**
 * 
 * @param {Object} param
 * @param {Object} callback
 */
base.Cyboze.prototype.selectBoard = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/board/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// 必須
		'group': '',				// グループの ID を指定します。 (GET リクエストのとき)
		// オプション
		//'embed-comment': 'true',	// “true” の場合にコメントも取得します。コメントへのアクセス権が必要です。
		//'start-index': '0',		// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',		// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
		//'board-folder': 			// 絞り込むカテゴリを指定します。値はID文字列を指定します。 “UNCLASSIFIED” を指定すると、未分類のトピックのみを取得できます。
	}, param);
	
	self.select(url, sendParam, method, callback);
};

/**
 * 
 * @param {Object} param
 * @param {Object} callback
 */
base.Cyboze.prototype.selectCabinet = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/gwCabinet/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// 必須パラメータ
		'group': '',				// グループの ID を指定します。 (GET リクエストのとき)
		'cabinet-folder': '',		// 絞り込むフォルダを指定します。値はID文字列を指定するか、”UNCLASSIFIED” で未分類、”ATTACH” で添付、”TRASH” でゴミ箱を指定します。
		// オプションパラメータ
		//'start-index': '0',			// コレクションを取得する場合のインデクスを指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',		// コレクションを取得する場合の最大件数を指定します。GET の場合のみ有効で、値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。
	}, param);
	
	self.select(url, sendParam, method, callback);
};

/**
 * 
 * @param {Object} param
 * @param {Object} callback
 */
base.Cyboze.prototype.selectCabinetFolder = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/gwCabinetFolder/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// 必須パラメータ
		'group': '',				// グループの ID を指定します。
		// オプションパラメータ
		//'start-index': '0',		// コレクションを取得する場合のインデクスを指定します。値は正数のみ可能です。デフォルトは “0” です。
		//'max-results': '20',		// コレクションを取得する場合の最大件数を指定します。値は正数のみ可能です。デフォルトは “20” です。上限は “100” です。	}
	}, param);
	
	self.select(url, sendParam, method, callback);
};

base.Cyboze.prototype.selectIcon = function(param, callback) {
	var self = this;
	
	var url = 'https://api.cybozulive.com/api/icon/V2';
	var method = 'GET';
	var sendParam = rewriteObj({
		// 必須パラメータ
		'type': '',			// 取得したいアイコンの種別を指定します。 “group” または “user”
		'group': '',		// アイコンを取得したいグループの ID を指定します。（ type が “group” のとき）
		'user': '',			// アイコンを取得したいユーザーの ID を指定します。（ type が “user” のとき）
		// オプションパラメータ
		//'group': ''		// グループでのアイコンを取得したい場合のグループの ID を指定します。（ type が “user” のとき）
	}, param);
	
	self.select(url, sendParam, method, callback);
};

module.exports = base;

