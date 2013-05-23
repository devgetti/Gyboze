module.exports = {
	win: {
		title : L('boardListWindowTitle'),
		backgroundColor : '#fff',
		exitOnClose : false,
		fullscreen : false,
		navBarHidden : false,
	},
	svBoard: {
		zIndex:2,
		showVerticalScrollIndicator:false
	},
	tvBoard: {
		width:Ti.Platform.displayCaps.platformWidth,
		//height:(100*20),
		backgroundColor:'#FFF',
		zIndex:1
	},
	tvrBoard: {
		backgroundSelectedColor: '#fff',
		height: 100,
		className: 'datarow',
		clickName: 'row'
	},
	viewImg: {
		backgroundImage:'/images/icon_rss.png',
		clickName:'photo'
	},
	lblTitle: {
		color:'#576996',
		font:{fontSize:16,fontWeight:'bold', fontFamily:'Arial'}
	},
	lblSummary: {
		color:'#222',
		font:{fontSize:14,fontWeight:'normal', fontFamily:'Arial'}
	},
	lblAuthorName: {
		color:'#222',
		font:{fontSize:14,fontWeight:'normal', fontFamily:'Arial'}
	},
	lblUpdateDate: {
		color:'#222',
		font:{fontSize:14,fontWeight:'normal', fontFamily:'Arial'}
	},
};

