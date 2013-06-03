var util = require('ui/util');
var styles = require('ui/handheld/loginWindow/styles');

function logics(win, model, delegate) {
	this.win = win;
	this.model = model;
	this.delegate = delegate;
}

logics.prototype.btnResyncClick = function(e) {
	var self = this;
	self.delegate.fireEvent('resyncAll');
};

module.exports = logics;
