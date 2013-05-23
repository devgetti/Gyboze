var util = require('model/util');

function todoCategory(db) {
	this.db = db;
	this.TABLE_NAME = 'todoCategory';
	this.columns = {
		'groupId': 'CHAR',
		'id': 'CHAR',
		'name': 'VARCHAR',
		'author': 'VARCHAR'
	};
	this.primaryKey = ['id'];
};
todoCategory.prototype = util.createObject(require('model/db/dao/base'));

module.exports = todoCategory;
