var websocket = require('http');
var Obj_tool = require("../utilTools/Obj_tools.js")

var isDebug = true
var websocket = {
	socket :null,
	isconnected:false,
	loginReconnectNum:0,
	ip:"127.0.0.1",
	port:8090,
	serivces_handler:{},
	sendMessageBuffer:[],

	sendMessage:function(msg){
		if(!msg.m_msgId)  return 
		msg = JSON.stringify(msg) 
		this.sendMessageBuffer.push(msg)
	},

	send:function(){
		if(this.sendMessageBuffer.length<=0) return
		if(this.isconnected){
			let msg = this.sendMessageBuffer.shift() 
			this.socket.send(msg)
		}
	},

	initWithSocketData:function(data){
		this.ip = data.ip || this.ip;
		this.port = data.post || this.port
	},

	onReceive:function(event){
		console.log("receive message")
		var str_or_buf = JSON.parse(event.data);
		this.dispatchEvent(str_or_buf.m_msgId,str_or_buf)
		if(isDebug){
			console.log("onRecive:",str_or_buf)
		}
	},

	onopen:function(data,stringtype){
		console.log("链接成功") 
		this.isconnected = true 
		this.Timeout = setInterval(function(){
			this.send()
		}.bind(this), 0.1) ;
	},

	onerror:function(data,stringtype){
		console.log("链接出错")
		this.socket.close()
	},

	onclose:function(){ 
		console.log("链接关闭")
		this.isconnected = false
		clearInterval(this.Timeout)
		this.Timeout = null
		setTimeout(() => {
			this.reconnection()
		}, 3000);
	},

	reconnection:function(ip,post){
		console.log("重新链接")
		if (this.loginReconnectNum < 3){
			this.loginReconnectNum = this.loginReconnectNum + 1
			this.connectServer()
			return
		}
		Obj_tool.removeLoadingTips()
		Obj_tool.showNoticeTips("提示","链接失败，请检查你的网络！")
	},

// -- 进行一些必须的善后处理,更包的时候,再把清理定时器等拿到这个函数内
	clearSocket:function(){
		this.loginReconnectNum = 0
	},

	connectServer:function(ip,port,callfunc){
		if(this.socket){
			this.socket.close() 
		}

		this.socket = new WebSocket("ws://"+ this.ip +":" +this.port); 
		this.socket.onclose=	this.onclose.bind(this)
		this.socket.onerror= this.onerror.bind(this)
		this.socket.onopen=	this.onopen.bind(this)
		this.socket.onmessage = this.onReceive.bind(this)
	},

	register_serivces_handler: function(eventType, target, method) {
		if(!eventType || !target || !method) return
		let serivces_handler = this.serivces_handler[eventType];
		if(serivces_handler){
			for (const key in serivces_handler) { 
				if(serivces_handler[key].obj== target &&  serivces_handler[key].method ==method) return
			} 
		} else{
			this.serivces_handler[eventType]= []
		}
		let listener ={"obj":target,"method":method}
		this.serivces_handler[eventType].push(listener) 
	},

	dispatchEvent: function(eventType,_param){
		if (!eventType){return}
		let listeners = this.serivces_handler[eventType] || []
		for (const value of (listeners)) { 
			if(value["obj"]){
				value["method"](_param)
			}
		} 
	},

    removeTargetEventListenerByType:function(target, eventType){
		if(!target || !eventType){
			return
		}

		let listeners = this.serivces_handler[eventType] || []
		for (const key in listeners) {
			const value = listeners[key];
			if(value.obj === target){
				delete listeners[key]
				return
			}
		} 
	}
}


module.exports = websocket;