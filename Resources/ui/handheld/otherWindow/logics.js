var util = require('ui/util');

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
