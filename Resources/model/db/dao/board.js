var util = require('model/util');

function board(db, option) {
	this.__super__(db, option);
	this.TABLE_NAME = 'board';
	this.columns = {
		'id': 'CHAR',
		'groupId': 'CHAR',
		'title': 'VARCHAR',
		'body': 'VARCHAR',
		'link_pc': 'VARCHAR',
		'link_mobile': 'VARCHAR',
		'createDate': 'DATE',
		'editFlg': 'CHAR',
		'author': 'VARCHAR'
	};
	this.primaryKey = ['groupId', 'id'];
};
module.exports = util.inherit(board, require('model/db/dao/base'));

/**
 * リスト取得用
 * @param {Object} condition
 * @param {Object} count
 */
board.prototype.cmdSelectForList = function(condition, count) {
	var self = this;

	var cols = ['groupId', 'id', 'title', 'author', 'createDate'];
	var condVals = [];

	// SELECT
	var schema = String.format('SELECT %s FROM %s ', cols.join(', '), self.TABLE_NAME);
	
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
	schema += 'ORDER BY createDate DESC ';

	// LIMIT
	if(typeof count === 'number') {
		schema += String.format('LIMIT 0,%d', count);
	}
	
	return self.db.fetch(self.execute(function(){ return self.db.execute(schema, condVals); }), cols);
};

/**
 * 詳細取得用
 * @param {Object} condition
 */
board.prototype.cmdSelectForDetail = function(condition) {
	var self = this;

	var cols = function() {
		var result = [];
		for(var col in self.columns) {
			result.push(col);
		}
		return result;
	}();
	var condVals = [];

	// SELECT
	var schema = String.format('SELECT %s FROM %s ', cols.join(', '), self.TABLE_NAME);
	
	// WHERE
	if(typeof condition === 'object' && util.isExistsProp(condition)) {
		var condCols = [];
		for(var col in condition) {
			condCols.push(col + ' = ?');
			condVals.push(condition[col]);
		}
		schema += String.format('WHERE %s ', condCols.join(' AND '));
	}
	
	// LIMIT
	schema += 'LIMIT 0,1 ';
	
	return self.db.fetch(self.execute(function(){ return self.db.execute(schema, condVals); }), cols);
};
