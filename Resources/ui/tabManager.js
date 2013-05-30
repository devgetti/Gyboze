var util = require('ui/util');

function tabManager() {
	this.tabs = [];	
}

module.exports = tabManager;

tabManager.prototype.create = function(style, model, delegate) {
	var tab = Ti.UI.createTab(style);
	tab.tabGroup = null;
	tab.windowStack = [];
	
	tab.getTabGroup = function(aa){
		return this.tabGroup;
	}
	
	tab.getWindowStack = function(){
		return this.windowStack;
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
	
	inheritFnc('open', function(window, options) {
		if(window instanceof Ti.UI.Window) {
			window.addEventListener('open', function(e) {
				tab.windowStack.push(window);
			});
			window.addEventListener('close', function(e) {
				tab.windowStack.splice(windowStack.indexOf(window), 1);
			});
			tab.setKeepScreenOn(true);
			return tab.___open(window, options);
		} else {
			throw new Error('window is not Ti.UI.Window!!');
		}
	});
	
	this.tabs.push(tab);

	return tab;
};
