var util = require('model/util');

function cabinetFolder(db) {
	this.db = db;
	this.TABLE_NAME = 'cabinetFolder';
	this.columns = {
		'groupId': 'CHAR',
		'id': 'CHAR',
		'name': 'VARCHAR',
		'author': 'VARCHAR'
	};
	this.primaryKey = ['groupId', 'id'];
};
cabinetFolder.prototype = util.createObject(require('model/db/dao/base'));

module.exports = cabinetFolder;
