var util = require('ui/util');

function windowManager() {
	this.windows = [];	
}

module.exports = windowManager;

windowManager.prototype.create = function(style, model, delegate) {
	var w = Ti.UI.createWindow(style);
	w.parent = null;
	
	w.getParent = function() {
		return this.parent;
	}
	
	function inheritFnc(fncName, overrideFnc) {
		w['___' + fncName] = w[fncName];
		w[fncName] = function() {
			try {
				return overrideFnc.apply(this, arguments);
			} catch(e) {
				Ti.API.error(e);
			}
		};
	}
	
	// XXX: For All
	/*
	for(var p in w) {
		if(typeof(w[p]) == 'function') {
			w['___' + p] = w[p];
			w[p] = function() {
				return w['___' + p](arguments);
			};
		}
	}
	*/
	
	function getParentTab(target) {
		var result = null;
		if(target instanceof Ti.UI.Tab) {
			result = target;
		} else if(target instanceof Ti.UI.Window) {
			result = getParentTab(target.parent)
		}
		return result;
	};
	
	inheritFnc('addEventListener', function(name, fnc) {
		w.___addEventListener(name, function() {
			try {
				return fnc.apply(this, arguments);
			} catch(e) {
				Ti.API.error(e);
			}
		});
	});
	
	inheritFnc('setBackgroundColor', function(color) {
		Ti.API.info('new bgc');
	});
	
	inheritFnc('open', function(params, parent) {
		//var parent = (params && params.parent) || null;
		var tab = getParentTab(parent);
		w.parent = parent;
		if(tab) {
			tab.open(w);
		} else {
			w.___open(params);
		}
	});
	
	w.addEventListener('open', function(e) {
		var tab = getParentTab(w.parent);
		if(tab) {
			tab.windowStack.push(w);
		}
	});
	
	w.addEventListener('close', function(e) {
		var tab = getParentTab(w.parent);
		if(tab) {
			tab.windowStack.splice(windowStack.indexOf(w), 1);
		}
	});
	
	this.windows.push(w);
	return w;
};

exports.clone_obj = function(obj) {
    var c = obj instanceof Array ? [] : {};
    for (var i in obj) {
        var prop = obj[i];

        if (typeof prop == 'object') {
           if (prop instanceof Array) {
               c[i] = [];

               for (var j = 0; j < prop.length; j++) {
                   if (typeof prop[j] != 'object') {
                       c[i].push(prop[j]);
                   } else {
                       c[i].push(clone_obj(prop[j]));
                   }
               }
           } else {
               c[i] = clone_obj(prop);
           }
        } else {
           c[i] = prop;
        }
    }

    return c;
};

/*
	
	require('ui/handheld/boardDetailWindow/styles').win
	/*
	var cl = function() {
		var w = Ti.UI.createWindow(require('ui/handheld/boardDetailWindow/styles').win);
		
		function f() {
			
		};
		
		for(var p in w) {
			if(typeof(w[p]) == 'function') {
				f.prototype[p] = function() {
					return w(arguments);
				};
			}
		}
		
		f.prototype.setBackgroundColor = function() {
			Ti.API.info('new bgc');
			w.setBackgroundColor(arguments);
		};
		
		f.prototype.open = function() {
			Ti.API.info('new open');
			w.open(arguments);
		};
		/*
	f.prototype.addEventListener = function(eventName, callback) {
		this.listeners = this.listeners || {};
		this.listeners[eventName] = this.listeners[eventName] || [];
		this.listeners[eventName].push(callback);
		
	};
	

	f.prototype.fireEvent = function(eventName, data) {
		var eventListeners = this.listeners[eventName] || [];
		for (var i = 0; i < eventListeners.length; i++) {
			eventListeners[i].call(this, data);
		}
	};

	};

	var win = new cl();
	
	
		win.addEventListener('open', function(e) {
			win.setBackgroundColor('Blue');
		});
		
	var tt = Ti.UI.createTab();
	tt.setWindow(win);
	
	var tg = Ti.UI.createTabGroup();
	tg.addTab(tt);
	tg.open();
	
	win.setBackgroundColor('Red');

	
	
	
	A.prototype = w;
	
	var B = function(){
		Ti.API.info('A constructor');
	};
	B.prototype = new A();
	B.prototype.open = function() {
		Ti.API.info('B.open constructor');
		A.prototype.open();
	};
//	var BN = new B();
//	BN.open();

	var tg = Ti.UI.createTabGroup();
	function C() {
		Ti.API.info('C constructor');
	};
	C.prototype = tg;
	
	var D = function(){
		Ti.API.info('D constructor');
	};
	D.prototype = new C();

	var t = Ti.UI.createTab(require('ui/common/mainTabGroup/styles').scheduleTab);
	function E() {
		Ti.API.info('E constructor');
	};
	E.prototype = t;
	
	var F = function(){
		Ti.API.info('F constructor');
	};
	F.prototype = new E();


	var tab = new F();
	tab.setWindow(aa);

	var tabGroup = new D();
	tabGroup.addTab(tab);
	tabGroup.open();

*/


