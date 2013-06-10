var util = require('ui/util');

function baseTab(style, model, delegate) {
	var self = this;
	var tab = Ti.UI.createTab(style);
	self.tab = tab;
	self.model = model;
	self.delegate = delegate;
	self.windowStack = [];
};
module.exports = baseTab;

baseTab.prototype.getTiTab = function() {
	return this.tab;
};

baseTab.prototype.open = function(win) {
	var self = this;
	if(win instanceof require('ui/baseWindow')) {
		return self.tab.open(win.getTiWindow());
	} else {
		throw new Error('Window is Unknown Type!!');
	}
};

baseTab.prototype.close = function(win) {
	var self = this;
	if(win instanceof require('ui/baseWindow')) {
		if(Ti.Platform.osname == 'android') {
			return win.close();
		} else {
			return self.tab.close(win.getTiWindow());
		}
	} else {
		throw new Error('Window is Unknown Type!!');
	}
};

baseTab.prototype.getWindowStack = function(){
	return windowStack;
}



