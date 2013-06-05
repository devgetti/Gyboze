var util = require('ui/util');
var styles = require('ui/handheld/cabinetListWindow/styles');

function cabinetListWindow(model, delegate) {
	this.__super__(styles.win, model, delegate);
	
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
	var logics = new (require('ui/handheld/cabinetListWindow/logics'))(win, model, delegate);

	// -- Events From User ---
	win.addEventListener('open', function(e) { logics.winOpen(); });
	win.tvCabinet.addEventListener('click', function(e) { logics.listClick(e); });

	// --- Events From Model ---
	model.cabinet.addEventListener('updateCabinet', function(e) { logics.updateCabinetList(e); });
	
};
module.exports = util.inherit(cabinetListWindow, require('ui/baseWindow'));

