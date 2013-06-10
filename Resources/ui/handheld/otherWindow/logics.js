var util = require('ui/util');
var styles = require('ui/handheld/loginWindow/styles');

exports.btnResyncClick = function(e) {
	var self = this;
	self.delegate.fireEvent('resyncAll');
};
