var util = require('ui/util');
/*
function baseWindow(style, model, delegate) {
	var self = Ti.UI.createWindow(style);
	self.style = style;
	self.parent = null;
	self.model = model;
	self.delegate = delegate;
	self.windowStack = [];

};
module.exports = util.inherit(baseWindow, Ti.UI.Window);

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
		tab.openWindow(self);
	} else {
		self.win.open();
	}
	self.parent = parent;
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


*/
/*
var baseWindow = function(style, model, delegate) {
	var self = Ti.UI.createWindow(style);
	self.style = style;
	self.parent = null;
	self.model = model;
	self.delegate = delegate;
	self.windowStack = [];

	self.open = function(parent) {
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
			tab.openWindow(self);
		} else {
			self.prototype.open();
		}
		self.parent = parent;
	};
	
	self.close = function() {
		var self = this;
		//if(self.tab) {
			//if(iOS) 
			//self.tab.close(self.win)
		//} else {
			self.win.close();
		//}
	};
//	return self;
};

module.exports = baseWindow;
*/
module.exports = (function() {
	(function() {
	    Object.prototype.proto = function(proto) {
	        for (key in proto) {
	            this.prototype[key] = proto[key];
	        }
	
	        return this;
	    };
	
	    Object.prototype.inherit = function(s) {
	        if (typeof(s) != 'function') throw new Error('cannot inherit from non-function variable');
	
	        var f = function() {};
	        f.prototype = new s();
	
	        var p = this.prototype;
	
	        this.prototype = new f();
	        this.proto(p);
	        
	        this.prototype.__super_proto__ = s.prototype;
	        
	        return this;
	    };
	    
	    Object.prototype.super = function() {
	        if (typeof(this.__super_proto__) != 'object') this.__super_proto__ = Object.prototype;
	        
	        if (typeof(this.__super__) != 'object') {
	            var s = {};
	            var p = this.__super_proto__;
	            
	            for (key in p) {
	                if (typeof(p[key]) != 'function') {
	                    s[key] = p[key];
	                    continue;
	                }
	
	                s[key] = (function(origin, target, method) {
	                    return function() {
	                        var args = Array.prototype.slice.call(arguments);
	
	                        return (this === origin) ? method.apply(target, args) : new method(args);
	                    };
	                })(s, this, p[key]);
	            }
	
	            this.__super__ = s;
	        }
	
	        return this.__super__;
	    };
	})();
	
	
	var win = Ti.UI.createWindow();
	var f = function(){};
	f.prototype = win;
	
	var baseWindow = function(style, model, delegate) {
		var self = this;
		self.style = style;
		self.parent = null;
		self.model = model;
		self.delegate = delegate;
		self.windowStack = [];
		for(var type in style) {}
	};
	baseWindow = baseWindow.inherit(Ti.UI.createWindow());

	//baseWindow.prototype = new f();
	
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
			tab.openWindow(self);
		} else {
			self.super().open.call(this);
		}
		win.parent = parent;
	};
		
	baseWindow.prototype.close = function() {
		
	};
	
	return baseWindow;
})();
