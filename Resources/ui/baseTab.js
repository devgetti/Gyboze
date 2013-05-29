/*
function baseTab(style, model, delegate) {
	this.tab = Ti.UI.createTab(style)
	this.style = style;
	this.model = model;
	this.delegate = delegate;
	this.windowStack = [];
};

module.exports = baseTab;

baseTab.prototype.getTab = function() {
	return this.tab;
};

baseTab.prototype.setWindow = function(window) {
	var self = this;
	if(window instanceof require('ui/baseWindow')) {
		var win = window.getWindow();
		win.addEventListener('open', function(e) {
			var stack = self.windowStack;
			stack.push(self);
			self.windowStack = stack;
		});
		win.addEventListener('close', function(e) {
			var stack = self.windowStack;
			stack.pop();
			self.windowStack = stack;
		});
		self.tab.window = win;
		window.parent = self;
	}
};

baseTab.prototype.openWindow = function(window) {
	var self = this;
	if(window instanceof require('ui/baseWindow')) {
		var win = window.getWindow();
		win.addEventListener('open', function(e) {
			var stack = self.windowStack;
			stack.push(self);
			self.windowStack = stack;
		});
		win.addEventListener('close', function(e) {
			var stack = self.windowStack;
			stack.pop();
			self.windowStack = stack;
		});
		self.tab.window = win;
		window.parent = self;
		
		self.tab.setKeepScreenOn(true);
		self.tab.open(window.getWindow());
	}
};

baseTab.prototype.closeWindow = function() {
	var win = this.windowStack.pop();
	//if(is Android) {
		this.tab.close();
	//}
};

baseTab.prototype.closeWindowAll = function() {
	for(var win in this.windowStack) {
		
	}
};
*/
/*
function baseTab(style, model, delegate) {
	var self = Ti.UI.createTab(style)
	self.style = style;
	self.windowStack = [];
	
	self.setWindow = function(window) {
		if(window instanceof require('ui/baseWindow')) {
			window.addEventListener('open', function(e) {
				var stack = self.windowStack;
				stack.push(self);
				self.windowStack = stack;
			});
			window.addEventListener('close', function(e) {
				var stack = self.windowStack;
				stack.pop();
				self.windowStack = stack;
			});
			self.window = window;
			window.parent = self;
		}
	};
	
	self.openWindow = function(window) {
		var self = this;
		if(window instanceof require('ui/baseWindow')) {
			window.addEventListener('open', function(e) {
				var stack = self.windowStack;
				stack.push(self);
				self.windowStack = stack;
			});
			window.addEventListener('close', function(e) {
				var stack = self.windowStack;
				stack.pop();
				self.windowStack = stack;
			});
			self.window = window;
			window.parent = self;
			
			self.setKeepScreenOn(true);
			self.open(window.getWindow());
		}
	};

	return self;
};

module.exports = baseTab;
*/
module.exports = (function() {
	var tab = Ti.UI.createTab();
	var f = function(){};
	f.prototype = tab;
	
	var baseTab = function(style, model, delegate) {
		var self = this;
		self.style = style;
		self.windowStack = [];
	};
	baseTab.prototype = new f();
	
	baseTab.prototype.setWindow = function(window) {
		var self = this;
		if(window instanceof require('ui/baseWindow')) {
			window.addEventListener('open', function(e) {
				var stack = self.windowStack;
				stack.push(self);
				self.windowStack = stack;
			});
			window.addEventListener('close', function(e) {
				var stack = self.windowStack;
				stack.pop();
				self.windowStack = stack;
			});
			self.window = window;
			window.parent = self;
		}
	};
	
	baseTab.prototype.openWindow = function(window) {
		var self = this;
		if(window instanceof require('ui/baseWindow')) {
			window.addEventListener('open', function(e) {
				var stack = self.windowStack;
				stack.push(self);
				self.windowStack = stack;
			});
			window.addEventListener('close', function(e) {
				var stack = self.windowStack;
				stack.pop();
				self.windowStack = stack;
			});
			self.window = window;
			window.parent = self;
			
			self.setKeepScreenOn(true);
			self.open(window.getWindow());
		}
	};
	
	return baseTab;
})();

