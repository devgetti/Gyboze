function db(dbName) {
	this.dbName = dbName;
	this.db = null;
	this.table = { };
};

db.prototype.open = function() {
	this.db = Titanium.Database.open(this.dbName);
};

db.prototype.close = function() {
	this.db.close();
	this.db = null;
};

db.prototype.isOpen = function() {
	return (this.db)?true:false;
}

db.prototype.begin = function() {
	return this.db.execute('BEGIN TRANSACTION');
};

db.prototype.end = function() {
	return this.db.execute('END TRANSACTION');
};

db.prototype.commit = function() {
	return this.db.execute('COMMIT');
};

db.prototype.rollback = function() {
	return this.db.execute('ROLLBACK');
};

db.prototype.execute = function() {
	var args = [], dstArgs = [];
	Array.prototype.push.apply( args, arguments );
	var cmd = args.shift();
	for(var key in args) {
		if(Array.isArray(args[key])) {
			if(args[key].length > 0) {
				dstArgs = dstArgs.concat(args[key]);
			}
		} else {
			dstArgs.push(args[key]);
		}
	}
	Ti.API.debug(cmd, dstArgs.join(','));
	return this.db.execute(cmd, dstArgs);
};

db.prototype.fetch = function(resultSet, columns) {
	var self = this;
	var results = [];
	while(resultSet.isValidRow()){
		var rowObj = {};
		for(var i in columns) {
			rowObj[columns[i]] = resultSet.fieldByName(columns[i]);
		}
		results.push(rowObj);
		resultSet.next();
	}
	return results;
};

module.exports = db;
