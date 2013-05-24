var util = require('model/util');

function cabinet(db, option) {
	this.__super__(db, option);
	this.TABLE_NAME = 'cabinet';
	this.columns = {
		'groupId': 'CHAR',
		'folderId': 'CHAR',
		'id': 'CHAR',
		'title': 'VARCHAR',
		'desc': 'VARCHAR',
		'fileName': 'VARCHAR',
		'fileSize': 'INT',
		'fileVersion': 'INT',
		'link_pc': 'VARCHAR',
		'link_mobile': 'VARCHAR',
		'updateDate': 'DATE',
		'author': 'VARCHAR'
	};
	this.primaryKey = ['groupId', 'folderId', 'id'];
};

module.exports = util.inherit(cabinet, require('model/db/dao/base'));
