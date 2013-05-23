module.exports = {
	win: {
		title : L('loginWindowTitle'),
		backgroundColor: '#fff',
		exitOnClose : false,
		fullscreen : false,
		navBarHidden : false,
	},
	lblUserId: {
		text: L('loginWindowUserId'),
		color: 'black',
		font: {
			fontSize: 12
		}
	},
	txtUserId: {
		editable: true,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		font: {
			fontSize: 12
		}
	},
	lblPassword: {
		text: L('loginWindowPassword'),
		color: 'black',
		font: {
			fontSize: 12
		}
	},
	txtPassword: {
		editable: true,
		borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		passwordMask: true,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		font: {
			fontSize: 12
		}
	},
	btnLogin: {
		title: L('loginWindowLogin')
	}
};
