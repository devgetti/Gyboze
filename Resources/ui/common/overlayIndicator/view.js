function overlayIndicator(model) {
	// require
	var util = require('ui/util');
	var styles = require('ui/common/overlayIndicator/styles');

	var self = Ti.UI.createWindow(styles.win);
	
	self.indicator = Ti.UI.createActivityIndicator(styles.indicator);

	self.add(self.indicator);

	self.addEventListener('open', function() {
		self.indicator.show();
	});
	self.addEventListener('close', function() {
		self.indicator.hide();
	});
	this.win = self;
};
module.exports = overlayIndicator;

overlayIndicator.prototype.show = function() {
	this.win.open();
}

overlayIndicator.prototype.hide = function() {
	this.win.close();
}

