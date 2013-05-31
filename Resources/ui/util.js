exports.createObject = function(type, isInstance) {
	var f = function(){};
	if(!isInstance) {
		f.prototype = type.prototype;
	} else {
		f.prototype = type;
	}
	return new f();
};

exports.inherit = function(subClass, superClass, isInstance) {
    subClass.prototype = exports.createObject(superClass, isInstance);
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