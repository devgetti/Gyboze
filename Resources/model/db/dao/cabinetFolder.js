var util = require('model/util');

function cabinetFolder(db, option) {
	this.__super__(db, option);
	this.TABLE_NAME = 'cabinetFolder';
	this.columns = {
		'groupId': 'CHAR',
		'id': 'CHAR',
		'name': 'VARCHAR',
		'author': 'VARCHAR'
	};
	this.primaryKey = ['groupId', 'id'];
};

module.exports = util.inherit(cabinetFolder, require('model/db/dao/base'));
