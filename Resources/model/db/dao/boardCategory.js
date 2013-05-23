var util = require('model/util');

function boardCategory(db) {
	this.db = db;
	this.TABLE_NAME = 'boardCategory';
	this.columns = {
		'groupId': 'CHAR',
		'id': 'CHAR',
		'name': 'VARCHAR',
		'author': 'VARCHAR'
	};
	this.primaryKey = ['groupId', 'id'];
};
boardCategory.prototype = util.createObject(require('model/db/dao/base'));

module.exports = boardCategory;
