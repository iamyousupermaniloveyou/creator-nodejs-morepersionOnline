var messageCode={
	loginGame: 1,  //登录消息
	loginResult: 2,//登录结果
	
	enterGameScene:3,//进入游戏场景
	SCRoomInfo:4,//房间信息

	hookFish : 5,  //请求钓鱼
	hookFishResult:6, //返回钓鱼结果 

	addPlayer:7,//添加玩家
	removePlayer:8,//玩家退出房间

	HeroPosition: 50, //位置消息

	DisConnection:100,//玩家掉线
	SOCKETSTATE  :101,//网络状态
	
}

module.exports = messageCode