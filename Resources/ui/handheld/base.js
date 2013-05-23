function base() {
};

base.prototype.open = function(tab) {
	var self = this;
	
	if(tab) {
		tab.setKeepScreenOn(true);
		tab.open(self.win);
		self.tab = tab;
	} else {
		self.win.open();
	}
};

base.prototype.close = function() {
	var self = this;
	//if(self.tab) {
		//if(iOS) 
		//self.tab.close(self.win)
	//} else {
		self.win.close();
	//}
};

module.exports = base;
