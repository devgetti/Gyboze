var util = require('ui/util');

function baseTab(style, model, delegate, window) {
	var self = this;
	self.tab = wm.createTab(style);
	self.model = model;
	self.delegate = delegate;
	
	if(window) {
		if(window instanceof Ti.UI.Window) {
			self.tab.setWindow(window);
		} else if(window instanceof require('ui/baseWindow')) {
			self.tab.setWindow(window.getTiWindow());
		} else {
			throw new Error('Window is Unknown Type!!');
		}
	}
};
module.exports = baseTab;

baseTab.prototype.getTiTab = function() {
	return this.tab;
};

baseTab.prototype.openWindow = function(window) {
	if(window instanceof Ti.UI.Window) {
		return this.tab.open(window);
	} else if(window instanceof require('ui/baseWindow')) {
		return this.tab.open(window.getTiWindow());
	} else {
		throw new Error('Window is Unknown Type!!');
	}
};

baseTab.prototype.close = function() {
	return this.tab.close();
};

