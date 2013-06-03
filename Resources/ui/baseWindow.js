var util = require('ui/util');

function baseWindow(style, model, delegate) {
	var self = this;
	self.window = wm.createWindow(style);
	self.model = model;
	self.delegate = delegate;
};
module.exports = baseWindow;

baseWindow.prototype.getTiWindow = function() {
	return this.window;
};

baseWindow.prototype.open = function(params, parent) {
	if(parent) {
		if(parent instanceof require('ui/baseWindow')) {
			return this.window.open(params, parent.getTiWindow());
		} else if(parent instanceof require('ui/baseTab')) {
			return this.window.open(params, parent.getTiTab());
		} else {
			return this.window.open(params, parent);
			//throw new Error('Parent is Unknown Type!!');
		}
	} else {
		return this.window.open(params);
	}
};

baseWindow.prototype.close = function() {
	return this.window.close();
};
