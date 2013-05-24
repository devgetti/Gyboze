var util = require('model/util');

function group(db, option) {
	this.__super__(db, option);
	this.TABLE_NAME = 'groups';	// SQLiteで'group'は予約語らしい
	this.columns = {
		'id': 'CHAR',
		'title': 'VARCHAR',
		'desc': 'VARCHAR',
		'link_pc': 'VARCHAR',
		'link_mobile': 'VARCHAR',
		'createDate': 'DATE',
		'author': 'VARCHAR'
	};
	this.primaryKey = ['id'];
};

module.exports = util.inherit(group, require('model/db/dao/base'));
