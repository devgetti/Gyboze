var util = require('model/util');

function cabinet(db) {
	this.db = db;
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
cabinet.prototype = util.createObject(require('model/db/dao/base'));

module.exports = cabinet;
