var util = require('ui/util');

function baseWindow(style, model, delegate, parent) {
	var self = this;
	var win = Ti.UI.createWindow(style);
	
	win.addEventListener('open', function(e) {
		var tab = self.getParentTab();
		if(tab) {
			var windowStack = tab.windowStack;
			windowStack.push(self);
			tab.windowStack = windowStack;
		}
	});
	
	win.addEventListener('close', function(e) {
		var tab = self.getParentTab();
		if(tab) {
			var windowStack = tab.windowStack;
			var index = windowStack.indexOf(self);
			windowStack.splice(index, 1);
			tab.windowStack = windowStack;
		}
	});

	self.win = win;
	//self.objectId = Math.random().toString(36).slice(-8);
	self.parent = parent;
	self.model = model;
	self.delegate = delegate;
	
	if(parent instanceof require('ui/baseTab')) {
		parent.getTiTab().window = win;
	}
};
module.exports = baseWindow;

baseWindow.prototype.getTiWindow = function() {
	return this.win;
	
};

baseWindow.prototype.open = function(params) {
	var self = this;
	var tab = self.getParentTab();
	if(tab) {
		tab.open(self);
	} else {
		self.win.open(params);
	}
};

baseWindow.prototype.close = function() {
	var self = this;
	var tab = self.getParentTab();
	if(tab) {
		tab.close(self);
	} else {
		self.win.close();
	}
};

var tabSearch = function(target){
	var result = null;
	var parent = wm.get(target.parentId);
	if(parent instanceof require('ui/baseTab')) {
		result = parent;
	} else if(parent instanceof require('ui/baseWindow')) {
		result = tabSearch(parent);
	}
	return result;
};

var tabSearch2 = function(targetId){
	var result = null;
	var target = wm.get(targetId);
	if(target instanceof require('ui/baseTab')) {
		result = target;
	} else if(target instanceof require('ui/baseWindow')) {
		result = tabSearch2(target.parentId);
	}
	return result;
};

var tabSearch3 = function(target){
	var result = null;
	if(target instanceof require('ui/baseTab')) {
		result = target;
	} else if(target instanceof require('ui/baseWindow')) {
		result = tabSearch3(target.parent);
	}
	return result;
};

baseWindow.prototype.getParentTab = function() {
	return tabSearch3(this);
};
