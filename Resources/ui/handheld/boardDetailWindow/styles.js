module.exports = {
	win: {
		title : L('boardListWindowTitle'),
		backgroundColor : '#fff',
		exitOnClose : false,
		fullscreen : false,
		navBarHidden : false,
	},
	tvBoard: {
	},
	tvrGroup: {
		touchEnabled : false,
		selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		lblItem: {
			text : 'グループ：',
			color : '#a0a0a0',
			font : {
				fontSize : 15,
			},
		},
		lblValue: {
			color : 'black',
			font : {
				fontSize : 15,
			},
		}
	},
	tvrTitle: {
		touchEnabled : false,
		selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		lblItem: {
			text : 'タイトル：',
			color : '#a0a0a0',
			font : {
				fontSize : 15,
			},
		},
		lblValue: {
			color : 'black',
			font : {
				fontSize : 15,
			},
		}
	},
	tvrUpdateDate: {
		touchEnabled : false,
		selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		lblItem: {
			text : '最終更新日：',
			color : '#a0a0a0',
			font : {
				fontSize : 15,
			},
		},
		lblValue: {
			color : 'black',
			font : {
				fontSize : 15,
			},
		}
	},
	tvrBody: {
		touchEnabled : true,
		selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
	},
		wbvValue: {
			backgroundcolor : '#fff',
			touchEnabled : true,
		},
	
	lblUpdateDate: {
		color:'#222',
		font:{fontSize:14,fontWeight:'normal', fontFamily:'Arial'}
	},
};

