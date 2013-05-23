var util = require('model/util');

/**
 * 
 * @param {Object} db
 */
function base(db) {
	this.db = db;
	this.TABLE_NAME = '';
	this.columns = {};
	this.primaryKey = [];
};

base.prototype.isExists = function() {
	var self = this;
	var result = false;
	var schema = '';
	schema = 'SELECT COUNT(*) CNT FROM sqlite_master WHERE type= ? and name= ? ';
	var rows = self.db.fetch(self.db.execute(schema, 'table', self.TABLE_NAME), ['CNT']);
	if(parseInt(rows[0]['CNT'], 10) > 0) {
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
	return self.db.execute(schema);
};

/**
 * 
 */
base.prototype.cmdDrop = function() {
	var self = this;
	var schema = '';
	schema = String.format('DROP TABLE IF EXISTS %s', self.TABLE_NAME);
	return self.db.execute(schema);
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
	
	return self.db.execute(schema, condVals);
};

/**
 * 
 * @param {Object} condition
 * @param {Object} order
 */
base.prototype.cmdSelectWithFetch = function(condition, order, count) {
	var self = this;
	var resultSet = null;
	try{
		resultSet = self.cmdSelect(condition, order, count);
		return self.db.fetch(resultSet, function() {
			var result = [];
			for(var col in self.columns) {
				result.push(col);
			}
			return result;
		}());
	} finally {
		if(resultSet) resultSet.close();
	}
};

/**
 * 
 * @param {Object} data
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
			return self.db.execute(schema, vals);
		};
		
		if(!Array.isArray(data)) {
			ret = insert(data);
		} else {
			for(var row in data) {
				insert(data[row]);
			}
		}
	}
};

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
		return self.db.execute(schema, vals, condVals);
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
	return self.db.execute(schema, condVals);
};

module.exports = base;
