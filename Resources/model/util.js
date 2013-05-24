exports.rewrite = function(dst) {
	if(dst) {
		for(var key in dst) {
			this[key] = dst[key];
		}
	}
};

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


/**
 * 
 * @param {Object} obj
 */
exports.isExistsProp = function(obj) {
	var result = false;
	for (var key in obj) {
		result = true;
		break;
	}
	return result;
};



/**
 * 
 * @param {Object} idStr
 * @param {Object} (Option)filter
 */
exports.feedId2objold = function(id, filter) {
	var results = {};
	if(id) {
		var ids = id.split(',');
		if(ids && ids.length >= 2) {
			for(var i = 0, size = ids.length; i < size; i = i + 2) {
				results[ids[i]] = ids[i+1];
			}
		}
	}
	return results;
};

exports.feedId2obj = function(id, category) {
	var result = {};
	if(id) {
		var target = [];
		if(category) {
			if(Array.isArray(category)) {
				target = category;
			} else {
				target.push(category);
			}
			for(var i in target) {
				var cat = target[i]['term'];
				var mat = id.match(cat + ',(.*?)(?:,|$)', 'i');
				if(mat) {
					result[cat] = mat[1];
				} else {
					result[cat] = null;
				}
			}
		} else {
			result['id'] = id;
		}
	}
	return result;
};

/**
 * 
 * @param {Object} target
 * @param {Object} idItem
 * @param {Object} valItem
 */
exports.feedItem2obj = function(target, idItem, valItem) {
	var result = {};
	if(target && idItem && valItem) {
		if(!Array.isArray(target)) {
			result[target[idItem]] = target[valItem];
		} else {
			for(var i in target) {
				result[target[i][idItem]] = target[i][valItem];
			}
		}
	}
	return result;
}


exports.rewriteObj = function(src, dst) {
	var result = {};
	if(!src) {
		result = dst;
	} else {
		result = src;
		for(var key in dst) {
			result[key] = dst[key];
		}
	}
	return result;
}

exports.isExistProp = function(obj) {
	var result = false;
	for (var key in obj) {
		result = true;
		break;
	}
	return result;
};
