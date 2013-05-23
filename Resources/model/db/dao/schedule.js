var util = require('model/util');

function schedule(db) {
	this.db = db;
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
schedule.prototype = util.createObject(require('model/db/dao/base'));

module.exports = schedule;
