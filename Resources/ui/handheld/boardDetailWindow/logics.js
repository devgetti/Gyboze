var util = require('ui/util');
var styles = require('ui/handheld/loginWindow/styles');

function logics(win, model, delegate) {
	this.win = win;
	this.model = model;
	this.delegate = delegate;
};
	
logics.prototype.winOpen = function() {
	

	
};

logics.prototype.updateBoardDetail = function(groupId, boardId) {
	var self = this;
	
	// DBからデータロード
	var group = self.model.group.getGroups(groupId)[0];
	var board = self.model.board.getBoardDetail(groupId, boardId);
	
	self.win.tvrGroup.lblValue.text = group.title;
	self.win.tvrTitle.lblValue.text = board.title;
	//self.win.tvrBody.wbvValue.html = "<html><head><meta name='viewport' content='user-scalable=0'></head><body>" + board.body + "</body></html>";
	
	var messageHtml = '<html><body>Hello, <a href="/documentation">Titanium</a>!</body></html>';
	messageHtml = convertMessageIntoPlainText(messageHtml);
	messageHtml = replaceLFcodeWithBreakTag(messageHtml);
	messageHtml = replaceProtocolStrWithUrlTag(messageHtml);
	function replaceLFcodeWithBreakTag(message) {
		return message.replace(/\n/g, '<br>');
	}
	
	function replaceProtocolStrWithUrlTag(message) {
		return message.replace(/((http|https):\/\/[\x21-\x7e]+)/gi, "<a href='$1'>$1</a>");
	}
	
	//引数のメッセージを平文に変換する。※クロスサイトスクリプティング防止
	function convertMessageIntoPlainText(message) {
		message = message.replace(/</g, "&lt;");
		return message.replace(/>/g, "&gt;");
	}
self.win.tvrBody.wbvValue.html = messageHtml;
};



module.exports = logics;
