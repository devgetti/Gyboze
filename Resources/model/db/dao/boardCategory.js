var util = require('model/util');

function boardCategory(db, option) {
	this.__super__(db, option);
	this.TABLE_NAME = 'boardCategory';
	this.columns = {
		'groupId': 'CHAR',
		'id': 'CHAR',
		'name': 'VARCHAR',
		'author': 'VARCHAR'
	};
	this.primaryKey = ['groupId', 'id'];
};

module.exports = util.inherit(boardCategory, require('model/db/dao/base'));
