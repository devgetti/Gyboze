var util = require('ui/util');

function windowManager() {
	this.objects = {};	
}

module.exports = windowManager;

windowManager.prototype.dump = function() {
	for(var o in this.objects) {
		Ti.API.info("id:" + o + " constructor:" + this.objects[o].constructor.name);
	}
}
windowManager.prototype.getObject = function(objectId) {
	return this.objects[objectId];
};

windowManager.prototype.createWindow = function(style) {
	var w = Ti.UI.createWindow(style);
	w.type = 'TiUIWindow';	// For iOS
	w.objectId = Math.random().toString(36).slice(-8);
	w.parentId = null;
	w.manager = this;
	
	w.getParent = function() {
		return this.manager.getObject(this.parentId);
	}
	
	w.getParentTab = function() {
		var manager = w.manager;
		var tabSearch = function(target){
			var result = null;
			var parent = manager.getObject(target.parentId);
			if(parent && parent.type) {
				if(parent.type == 'TiUITab') { // instanceof Ti.UI.Tab
					result = parent;
				} else if(parent.type == 'TiUIWindow') { // instanceof Ti.UI.Window
					result = tabSearch(parent);
				}
			}
			return result;
		};
		
		return tabSearch(this);
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
	
	inheritFnc('addEventListener', function(name, fnc) {
		w.___addEventListener(name, function() {
			try {
				return fnc.apply(this, arguments);
			} catch(e) {
				Ti.API.error(e);
			}
		});
	});
	
	inheritFnc('open', function(params, parent) {
		//var parent = (params && params.parent) || null;
		if(parent) {
			var tab = w.getParentTab(parent);
			w.parentId = parent.objectId;
			if(tab) {
				tab.open(w);
			} else {
				w.___open(params);
			}
		} else {
			w.___open(params);
		}
	});
	
	w.addEventListener('open', function(e) {
		var tab = w.getParentTab();
		if(tab) {
			tab.addWindowStack(w);
		}
	});
	
	w.addEventListener('close', function(e) {
		var tab = w.getParentTab();
		if(tab) {
			tab.delWindowStack(w);
		}
	});
	
	this.objects[w.objectId] = w;
	return this.objects[w.objectId];
};

windowManager.prototype.createTab = function(style) {
	var tab = Ti.UI.createTab(style);
	var windowStack = [];
	tab.type = 'TiUITab';	// For iOS
	tab.objectId = Math.random().toString(36).slice(-8);
	tab.parentId = null;
	tab.manager = this;
	tab.tabGroup = null;
	
	tab.getParent = function() {
		return this.manager.getObject(this.parentId);
	}
	
	tab.getWindowStack = function(){
		return windowStack;
	}
	
	tab.addWindowStack = function(win){
		windowStack.push(win.objectId);
	}
	
	tab.delWindowStack = function(win){
		var index = windowStack.indexOf(win.objectId);
		return windowStack.splice(index, 1);
	}
	
	function inheritFnc(fncName, overrideFnc) {
		tab['___' + fncName] = tab[fncName];
		tab[fncName] = function() {
			try {
				return overrideFnc.apply(this, arguments);
			} catch(e) {
				Ti.API.error(e);
			}
		};
	}
	
	inheritFnc('addEventListener', function(name, fnc) {
		tab.___addEventListener(name, function() {
			try {
				return fnc.apply(this, arguments);
			} catch(e) {
				throw new Error('addEventListener Faild!!');
			}
		});
	})
	
	inheritFnc('open', function(win, options) {
		if(win && win.type) {
			if(win.type == 'TiUIWindow') { // instanceof Ti.UI.Window
				tab.setKeepScreenOn(true);
				return tab.___open(win, options);
			} else {
				throw new Error('window is not Ti.UI.Window!!');
			}
		}
	});
	
	inheritFnc('setWindow', function(win) {
		if(win && win.type) {
			if(win.type == 'TiUIWindow') { // instanceof Ti.UI.Window
				win.parentId = tab.objectId;
				return tab.___setWindow(win);
			} else {
				throw new Error('window is not Ti.UI.Window!!');
			}
		}
	});

	this.objects[tab.objectId] = tab;
	return this.objects[tab.objectId];
};
