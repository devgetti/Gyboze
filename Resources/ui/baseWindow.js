function baseWindow(style, model, delegate) {
	var self = this;
	self.win = Ti.UI.createWindow(style);
	self.style = style;
	self.parent = null;
	self.model = model;
	self.delegate = delegate;
	self.windowStack = [];

};
module.exports = baseWindow;

//(function() {
//	baseWindow.prototype = {
//		
//	};
//})();

baseWindow.prototype.getWindow = function() {
	return this.win;
};

baseWindow.prototype.open = function(parent) {
	var self = this;
	var getParentTab = function(window) {
		var result = null;
		if(window instanceof require('ui/baseWindow')) {
			var parent = window.parent;
			if(parent instanceof require('ui/baseTab')) {
				result = parent;
			} else if(parent instanceof require('ui/baseWindow')) {
				result = getParentTab(parent);
			} else {
				result = null;
			}
		}
		return result;
	};
	
	var tab = getParentTab(parent);
	if(tab) {
		tab.openWindow(child);
	} else {
		child.open();
	}
	child.parent = self;
};

baseWindow.prototype.close = function() {
	var self = this;
	//if(self.tab) {
		//if(iOS) 
		//self.tab.close(self.win)
	//} else {
		self.win.close();
	//}
};
