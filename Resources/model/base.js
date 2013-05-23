/*
 * 
 */
function base() {
	this.listeners = {};
};

/**
 * 
 * @param {Object} eventName
 * @param {Object} callback
 */
base.prototype.addEventListener = function(eventName, callback) {
	this.listeners = this.listeners || {};
	this.listeners[eventName] = this.listeners[eventName] || [];
	this.listeners[eventName].push(callback);
};

/**
 * 
 * @param {Object} eventName
 * @param {Object} data
 */
base.prototype.fireEvent = function(eventName, data) {
	var eventListeners = this.listeners[eventName] || [];
	for (var i = 0; i < eventListeners.length; i++) {
		eventListeners[i].call(this, data);
	}
};

module.exports = base;
