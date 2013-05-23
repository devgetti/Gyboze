/**
 * 
 * @param {Object} view
 * @param {Object} w
 * @param {Object} h
 */
exports.setViewSize = function(view, w, h) {
	view.width = w;
	view.height = h;
};

/**
 * 
 * @param {Object} view
 * @param {Object} x
 * @param {Object} y
 */
exports.setViewPos = function(view, x, y) {
	view.left = x;
	view.top = y;
};

/**
 * 
 * @param {Object} view
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
exports.setViewRect = function(view, x, y, w, h) {
	this.setViewPos(view, x, y);
	this.setViewSize(view, w, h);
};

exports.eventClosure = function(callback) {
	return function(e) {
		callback(e);
	};
};

exports.addEventListener = function(target, event, callback) {
	return target.addEventListener(function(e) {
		callback();
	});
};

exports.createObject = function(type) {
	var f = function(){};
	f.prototype = type.prototype;
	return new f();
};
