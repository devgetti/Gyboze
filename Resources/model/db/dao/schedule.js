var util = require('model/util');

function schedule(db, option) {
	this.__super__(db, option);
	this.TABLE_NAME = 'schedule';
	this.columns = {
		'groupId': 'CHAR',
		'id': 'CHAR',
		'title': 'VARCHAR',
		'desc': 'VARCHAR',
		'startTime': 'DATE',
		'endTime': 'DATE',
		'repeatFlg': 'CHAR',
		'link_pc': 'VARCHAR',
		'link_mobile': 'VARCHAR',
		'author': 'VARCHAR',
	};
	this.primaryKey = ['groupId', 'id'];
};

module.exports = util.inherit(schedule, require('model/db/dao/base'));
