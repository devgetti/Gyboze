module.exports = {
	win: {
		title : L('loginWin_title'),
		backgroundColor : '#fff',
		exitOnClose : false,
		fullscreen : false,
		navBarHidden : false,
	},
	lblUserId: {
		text: 'User ID',
		color: 'black',
		font: {
			fontSize: 12
		}
	},
	txtUserId: {
		editable: false,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		font: {
			fontSize: 12
		}
	},
	btnResync: {
		title: 'Resync'
	},
	btnLogout: {
		title: L('logout')
	}
};

