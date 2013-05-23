var util = require('model/util');

function group(db) {
	this.db = db;
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
group.prototype = util.createObject(require('model/db/dao/base'));

module.exports = group;
