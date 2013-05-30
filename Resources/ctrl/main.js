function Application() {
	this.db = new (require('model/db/db'))('Gyboze');
	this.indicator = new (require('ui/common/overlayIndicator/view'))();
	var property = {
		consumerKey: '55777f36788ab93401ad0b9bbd9df86e7b844c5',
		consumerSecret: '7cc3c53ad370dd539eb5b617e78918aa7ea250',
	};
	if(Ti.App.Properties.hasProperty('CybozeAccessToken') && Ti.App.Properties.hasProperty('CybozeAccessSecret')) {
		property['accessTokenKey'] = Ti.App.Properties.getString('CybozeAccessToken');
		property['accessTokenSecret'] = Ti.App.Properties.getString('CybozeAccessSecret');
	};
	this.cyboze = new (require('model/service/cybozelive/cybozelive')).Cyboze(property);
}

Application.prototype.appStart = function() {
	var self = this;

	// === 起動時ロジック ===========================================
	var optDb = { autoConnect: true };
	self.db.table = {
		group: new (require('model/db/dao/group'))(self.db, optDb),
		boardCategory: new (require('model/db/dao/boardCategory'))(self.db, optDb),
		todoCategory: new (require('model/db/dao/todoCategory'))(self.db, optDb),
		board: new (require('model/db/dao/board'))(self.db, optDb),
		cabinet: new (require('model/db/dao/cabinet'))(self.db, optDb),
		cabinetFolder: new (require('model/db/dao/cabinetFolder'))(self.db, optDb),
		schedule: new (require('model/db/dao/schedule'))(self.db, optDb),
		todo: new (require('model/db/dao/todo'))(self.db, optDb)
	};
	self.db.createDB = function() {
		self.db.open();
		for(var key in self.db.table) {
			self.db.table[key].cmdCreate();
		}
		self.db.close();
	};
	self.db.dropDB = function() {
		self.db.open();
		for(var key in self.db.table) {
			self.db.table[key].cmdCreate();
		}
		self.db.close();
	};
	
	{
		var version = Ti.App.getVersion();
		var current = Ti.App.Properties.getString('System.Version', 0);
		if (current <= 0) {
			// 初回起動時
			self.db.createDB();
		}
		if (current < version) {
			// バージョンアップ時
		}
		Ti.App.Properties.setString('System.Version', version);	// Version の値を CV としてしまう（次回に備える）
	}
	
	// === Model ============================================
	var model = {
		session: new (require('model/session'))(self.db, self.cyboze),
		newly: new (require('model/newly'))(self.db, self.cyboze),
		group: new (require('model/group'))(self.db, self.cyboze),
		schedule: new (require('model/schedule'))(self.db, self.cyboze),
		todo: new (require('model/todo'))(self.db, self.cyboze),
		board: new (require('model/board'))(self.db, self.cyboze),
		cabinet: new (require('model/cabinet'))(self.db, self.cyboze),
		dummy: new (require('model/dummy'))(self.db, self.cyboze),
	};
	
	// === View ============================================
	var ctrlDelegate = new (require('ctrl/delegate'))();
	/*
	var view = {
		loginWindow: new (require('ui/handheld/loginWindow/view'))(model, ctrlDelegate),
		//newlyWindow: new (require('ui/handheld/newlyListWindow/view'))(model, ctrlDelegate),
		tabGroup: new (require('ui/common/mainTabGroup/view'))(model, ctrlDelegate)
	};
	*/
	scheduleList = new (require('ui/handheld/scheduleListWindow/view'))(model, ctrlDelegate);
	scheduleTab = new (require('ui/baseTab'))(require('ui/common/mainTabGroup/styles').scheduleTab, model, ctrlDelegate, scheduleList);
	var tg = Ti.UI.createTabGroup();
	tg.addTab(scheduleTab.getTiTab());
	tg.open();
/*	
	// === Logics ============================================
	var logics = new (require('ctrl/logics'))(model, view, self);
	
	// === Command ============================================
	ctrlDelegate.addEventListener('procPause', function(param){ self.indicator.show(); });
	ctrlDelegate.addEventListener('procResume', function(param){ self.indicator.hide(); });
	
	ctrlDelegate.addEventListener('login', function(param) { logics.loginLogic(param); });
	ctrlDelegate.addEventListener('resyncAll', function(param) { logics.syncData(param); });
	ctrlDelegate.addEventListener('logout', function(param){});
	ctrlDelegate.addEventListener('reloadNewly', function(param){});
	ctrlDelegate.addEventListener('reloadSchedule', function(param){});
	ctrlDelegate.addEventListener('reloadTodo', function(param){});
	ctrlDelegate.addEventListener('reloadBoard', function(param){});
	ctrlDelegate.addEventListener('reloadCabinet', function(param){});
	ctrlDelegate.addEventListener('openNewly', function(param){});
	ctrlDelegate.addEventListener('openEvent', function(param){});
	ctrlDelegate.addEventListener('openTodo', function(param){});
	ctrlDelegate.addEventListener('openBoard', function(param){});
	ctrlDelegate.addEventListener('openCabinet', function(param){});
	
	model.group.addEventListener('updateGroup', function(param){});

	// === Error Handling ============================================
	self.cyboze.addEventListener('Unauthorized', function(data) { logics.loginCyboze(data); });
	self.cyboze.addEventListener('AuthError', function(data) { alert('しばらく待ってアクセスしてね。'); });
	self.cyboze.addEventListener('ServerError', function(data) { alert('しばらく待ってアクセスしてね。'); });
	self.cyboze.addEventListener('UnexceptedError', function(data) { alert('管理者に連絡するとかしてね。'); });
	
	// === Logic ============================================
	// Open TabGroup
	view.tabGroup.open();
*/
};

Application.prototype.appEnd = function() {
	var self = this;
	self.tabGroup.close();
	self.tabGroup = null;
};

module.exports = Application;
