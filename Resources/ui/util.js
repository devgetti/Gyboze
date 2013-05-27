exports.createObject = function(type) {
	var f = function(){};
	f.prototype = type.prototype;
	return new f();
};

exports.inherit = function(subClass, superClass) {
    subClass.prototype = exports.createObject(superClass);
    subClass.prototype.constructor = subClass;
    subClass.prototype.__super__ = function () {
        var originalSuper = this.__super__;
        this.__super__ = superClass.prototype.__super__ || null;
        superClass.apply(this, arguments);
        if (this.constructor == subClass)
            delete this.__super__;
        else
            this.__super__ = originalSuper;
    };
    return subClass;
};


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

/**
 * 
 * @param {Object} target
 * @param {Object} event
 * @param {Object} callback
 */
exports.addEventListener = function(target, event, callback) {
	return target.addEventListener(function(e) {
		callback();
	});
};
