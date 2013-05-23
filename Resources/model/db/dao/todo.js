var util = require('model/util');

function todo(db) {
	this.db = db;
	this.TABLE_NAME = 'todo';
	this.columns = {
		'groupId': 'CHAR',
		'id': 'CHAR',
		'title': 'VARCHAR',
		'body': 'VARCHAR',
		'status': 'VARCHAR',
		'priority': 'CHAR',
		'link_pc': 'VARCHAR',
		'link_mobile': 'VARCHAR',
		'updateDate': 'DATE',
		'author': 'VARCHAR'
	};
	this.primaryKey = ['groupId', 'id'];
};
todo.prototype = util.createObject(require('model/db/dao/base'));

module.exports = todo;
