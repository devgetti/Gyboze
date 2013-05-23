var util = require('model/util');

function dummy(db, cyboze) {
	this.db = db;
	this.cyboze = cyboze;
	this.listeners = {};
};
dummy.prototype = util.createObject(require('model/base'));

dummy.prototype.testCyboze = function(param) {
	var self = this;
	
	
	self.cyboze.selectGroup({}, function(result) { 
		if(result.success) {
			Ti.API.info('GROUP:' + JSON.stringify(result));
			var groupId = util.feedId2obj(result.data.entry[2].id, result.data.entry[2].category)['GROUP'];
			
			self.cyboze.selectNewly({}, function(result) {});
			
			self.cyboze.selectEvent({group:groupId}, function(result) {});
			
			self.cyboze.selectSchedule({}, function(result) {});
			
			self.cyboze.selectTodo({group:groupId}, function(result) {});
			
			self.cyboze.selectBoardCategory({group:groupId}, function(result) {});
			
			self.cyboze.selectBoard({group:groupId}, function(result) {});
			
			self.cyboze.selectCabinet({group:groupId}, function(result) {});
		}
	});
};

dummy.prototype.testSQLite = function(param) {
	var self = this;
	var board = new (require('model/db/dao/board'))(self.db);
	
	board.cmdCreate();
	
	self.db.begin();
	board.cmdInsert({id:'1', title:'test', body:'detail', createDate:'2013/02/25'});
	self.db.commit();
	var rows = board.cmdSelect({id:'1'});
	while(rows.isValidRow()){
		Titanium.API.info('ID: ' + rows.field(0) + ' NAME: ' + rows.fieldByName('title'));
		rows.next();
	}
	rows.close();
	
	var rowsFetch = boad.cmdSelectWithFetch({id: '1'});
	Ti.API.info(JSON.stringify(rowsFetch[0]));
		
	self.db.begin();
	board.cmdUpdate({title:'testUpdate'}, {id:'1'});
	self.db.commit();

	self.db.begin();
	board.cmdDelete({id:'1'});
	self.db.commit();
	
	board.cmdDrop();
};

module.exports = dummy;
