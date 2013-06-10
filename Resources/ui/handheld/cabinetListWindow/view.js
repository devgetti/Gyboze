var util = require('ui/util');
var styles = require('ui/handheld/cabinetListWindow/styles');
var logics = require('ui/handheld/cabinetListWindow/logics');

function cabinetListWindow(model, delegate, parent) {
	this.__super__(styles.win, model, delegate, parent);
	var self = this;
	var win = this.win;
	
	// === Component ===============
	win.tvCabinet = Ti.UI.createTableView(styles.tvCabinet);
	win.tvCabinet.search = function(){
		var search = Titanium.UI.createSearchBar({
			barColor:'#385292',
			showCancel:false,
			hintText:'search'
		});
		search.addEventListener('change', function(e) { e.value; });
		search.addEventListener('return', function(e) { search.blur(); });
		search.addEventListener('cancel', function(e) { search.blur(); });
		return search;
	}();
	
	// --- Layout ---
	util.setViewRect(win.tvCabinet, 0, 0, '100%', '100%');
	
	// --- Add ---
	win.add(win.tvCabinet);
	
	// === Logics ====================
	// -- Events From User ---
	win.addEventListener('open', function(e) { self.winOpen(); });
	win.tvCabinet.addEventListener('click', function(e) { self.listClick(e); });

	// --- Events From Model ---
	model.cabinet.addEventListener('updateCabinet', function(e) { self.updateCabinetList(e); });
	
};
module.exports = util.inherit(cabinetListWindow, require('ui/baseWindow'));
util.expandFnc(cabinetListWindow, logics);
