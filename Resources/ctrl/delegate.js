function delegate(ctrl) {
	this.listeners = {};
};

delegate.prototype.addEventListener = function(todoName, callback) {
	this.listeners = this.listeners || {};
	this.listeners[todoName] = this.listeners[todoName] || [];
	this.listeners[todoName].push(callback);
};

delegate.prototype.fireEvent = function(todoName, data) {
	var todoListeners = this.listeners[todoName] || [];
	for (var i = 0; i < todoListeners.length; i++) {
		todoListeners[i].call(this, data);
	}
};

module.exports = delegate;
