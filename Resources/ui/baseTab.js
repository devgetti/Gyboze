var util = require('ui/util');

function baseTab(style, model, delegate, win) {
	var self = this;
	self.tab = wm.createTab();
	self.model = model;
	self.delegate = delegate;
	
	if(win) {
		if(win instanceof require('ui/baseWindow')) {
			self.tab.window = win.getTiWindow();
		} else if(win.type == "TiUIWindow") { // instanceof Ti.UI.Window
			self.tab.window = win;
		} else {
			throw new Error('Window is Unknown Type!!');
		}
	}
};
module.exports = baseTab;

baseTab.prototype.getTiTab = function() {
	return this.tab;
};

baseTab.prototype.openWindow = function(win) {
	if(win) {
		if(win instanceof require('ui/baseWindow')) {
			return this.tab.open(win.getTiWindow());
		} else if(win.type == "TiUIWindow") { // instanceof Ti.UI.Window
			return this.tab.open(win);
		} else {
			throw new Error('Window is Unknown Type!!');
		}
	}
};

baseTab.prototype.close = function() {
	return this.tab.close();
};

