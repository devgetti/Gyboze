function logics(model, delegate) {
	this.model = model;
	this.delegate = delegate;
};
	
logics.prototype.winOpen = function() {
	var group = this.model.group.getGroupIds()[0];
	this.model.board.updateBoardList({ group: group });
};

logics.prototype.updateBoardDetail = function(result) {
	if(result.success) {

	}
};

module.exports = logics;
