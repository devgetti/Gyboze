var util = require('model/util');

function todoCategory(db, option) {
	this.__super__(db, option);
	this.TABLE_NAME = 'todoCategory';
	this.columns = {
		'groupId': 'CHAR',
		'id': 'CHAR',
		'name': 'VARCHAR',
		'author': 'VARCHAR'
	};
	this.primaryKey = ['id'];
};

module.exports = util.inherit(todoCategory, require('model/db/dao/base'));
