var util = require('model/util');

/**
 * 
 * @param {Object} db
 */
function base(db, options) {
	this.db = db;
	this.TABLE_NAME = '';
	this.columns = {};
	this.primaryKey = [];
	if (!options) { options = {}; }
	this.autoConnect = options.autoConnect || true;
	this.autoTran = options.autoTran || true;
};

base.prototype.isExists = function() {
	var self = this;
	var result = false;
	var schema = '';
	schema = 'SELECT COUNT(*) CNT FROM sqlite_master WHERE type= ? and name= ? ';
	var result = self.selectWithFetch(schema, ['table', self.TABLE_NAME], 'CNT');
	if(parseInt(result[0]['CNT'], 10) > 0) {
		result = true;
	}
	return result;
};

/**
 * 
 */
base.prototype.cmdCreate = function() {
	var self = this;
	var schema = '';
	var cols = [], condVals = [];
	
	for(var col in self.columns) {
		cols.push(col + ' ' + self.columns[col]);
	}
	if(this.primaryKey && this.primaryKey.length > 0) {
		cols.push(String.format('PRIMARY KEY (%s)', this.primaryKey.join(', ')));
	}
	schema = String.format('CREATE TABLE IF NOT EXISTS %s (%s)', self.TABLE_NAME, cols.join(', '));
	return self.execute(schema);
};

/**
 * 
 */
base.prototype.cmdDrop = function() {
	var self = this;
	var schema = '';
	schema = String.format('DROP TABLE IF EXISTS %s', self.TABLE_NAME);
	return self.execute(schema);
};

/**
 * 
 * @param {Object} condition
 * @param {Object} sort
 * @param {Object} count
 */
base.prototype.cmdSelect = function(condition, sort, count) {
	var self = this;

	var condVals = [];
	var colNames = function() {
		var result = [];
		for(var col in self.columns) {
			result.push(col);
		}
		return result;
	}();

	// SELECT
	var schema = String.format('SELECT * FROM %s ', self.TABLE_NAME);
	
	// WHERE
	if(typeof condition === 'object' && util.isExistsProp(condition)) {
		var condCols = [];
		for(var col in condition) {
			condCols.push(col + ' = ?');
			condVals.push(condition[col]);
		}
		schema += String.format('WHERE %s ', condCols.join(' AND '));
	}
	
	// ORDER BY
	if(typeof sort === 'object' && util.isExistsProp(sort)) {
		var sortCols = [];
		for(var col in sort) {
			sortCols.push(col + ' ' + sort[col]);
		}
		order = String.format('ORDER BY %s ', sortCols.join(', '));
	}

	// LIMIT
	if(typeof count === 'number') {
		schema += String.format('LIMIT 0,%d', count);
	}
	
	return self.selectWithFetch(schema, condVals, colNames);
};

/**
 * 
 * @param {Object} data InsertData Support "{ colA: valA, colB: valB...}" or "[{ colA: valA, colB: valB...},{ colA: valA, colB: valB...}]"
 */
base.prototype.cmdInsert = function(data) {
	var self = this;
	if(!data) {
		// データなしの場合、何もしない
	} else {
		
		var insert = function(row) {
			// データあり
			var schema = '';
			var cols = [], vals = [], reps = [];
			
			// 値
			for(var col in row) {
				cols.push(col);
				vals.push(row[col]);
				reps.push('?');
			}
			schema = String.format('INSERT INTO %s(%s) VALUES (%s)', self.TABLE_NAME, cols.join(', '), reps.join(', '));
			return self.execute(schema, vals);
		};
		
		if(!Array.isArray(data)) {
			return insert(data);
		} else {
			for(var row in data) {
				insert(data[row]);
			}
		}
	}
};

/**
 * 
 * @param {Object} or {Array} data InsertData Support "{ colA: valA, colB: valB...}" or "[{ colA: valA, colB: valB...},{ colA: valA, colB: valB...}]"
 */
base.prototype.cmdUpdate = function(data, condition) {
	var self = this;
	if(!data) {
		// データなしの場合、何もしない
	} else {
		// データあり
		var schema = '';
		var cols = [], vals = [], condCols = [], condVals = [];
		
		// 値
		for(var col in data) {
			cols.push(col + ' = ?');
			vals.push(data[col]);
		}
		
		// 条件
		if(!util.isExistsProp(condition)) {
			schema = String.format('UPDATE %s SET %s ', self.TABLE_NAME, cols.join(', '));
		} else {
			for(var col in condition) {
				condCols.push(col + ' = ?');
				condVals.push(condition[col]);
			}
			schema = String.format('UPDATE %s SET %s WHERE %s ', self.TABLE_NAME, cols.join(', '), condCols.join(' AND '));
		}

		return self.execute(schema, vals, condVals);
	}
};

base.prototype.cmdDelete = function(condition) {
	var self = this;
	// データあり
	var schema = '';
	var condCols = [], condVals = [];
	
	// 条件
	if(!util.isExistsProp(condition)) {
		schema = String.format('DELETE FROM %s ', self.TABLE_NAME);
	} else {
		for(var col in condition) {
			condCols.push(col + ' = ?');
			condVals.push(condition[col]);
		}
		schema = String.format('DELETE FROM %s WHERE %s ', self.TABLE_NAME, condCols.join(' AND '));
	}

	return self.execute(schema, condVals);
};

base.prototype.execute = function(cmd, vrgs) {
	var self = this;
	var ret = null;
	if(self.autoConnect && !self.db.isOpen()) {
		self.db.open();
		try {
			if(self.autoTran) self.db.begin();
			ret = self.db.execute.apply(this, arguments);
			if(self.autoTran) self.db.commit();
		} catch(e) {
			if(self.autoTran) self.db.rollback();
			throw e;
		} finally {
			self.db.close();
		}
	} else {
		try {
			if(self.autoTran) self.db.begin();
			ret = self.db.execute.apply(this, arguments);
			if(self.autoTran) self.db.commit();
		} catch(e) {
			if(self.autoTran) self.db.rollback();
			throw e;
		}
	}
	return ret;
};

base.prototype.fetch = function(resultSet, fetchColNames) {
	var self = this;
	var results = [];
	while(resultSet.isValidRow()){
		var rowObj = {};
		for(var i in fetchColNames) {
			rowObj[fetchColNames[i]] = resultSet.fieldByName(fetchColNames[i]);
		}
		results.push(rowObj);
		resultSet.next();
	}
	return results;
};

/**
 * 
 * @param {Object} condition
 * @param {Object} order
 */
base.prototype.selectWithFetch = function(schema, condVals, fetchColNames) {
	var self = this;
	var resultSet = null;
	
	if(self.autoConnect && !self.db.isOpen()) {
		self.db.open();
		try {
			resultSet = self.execute(schema, condVals);
			try {
				ret = self.fetch(resultSet, fetchColNames);
			} finally {
				resultSet.close();
			}
		} finally {
			self.db.close();
		}
	} else {
		resultSet = self.execute(schema, condVals);
		try {
			ret = self.fetch(resultSet, fetchColNames);
		} finally {
			resultSet.close();
		}
	}
	return ret;
};

module.exports = base;
