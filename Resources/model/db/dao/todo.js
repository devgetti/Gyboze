var util = require('model/util');

function todo(db, option) {
	this.__super__(db, option);
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

module.exports = util.inherit(todo, require('model/db/dao/base'));
