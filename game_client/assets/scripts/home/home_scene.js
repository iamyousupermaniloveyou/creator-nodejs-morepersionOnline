var websocket = require("../socket/websocket")
const MessageInit = require("../socket/MessageInit.js")
var Obj_tool = require("../utilTools/Obj_tools.js")
var bind_camera = require("../bind_camera.js")
var ugame = require("../utilTools/ugame.js")


cc.Class({
    extends: cc.Component,

    properties: {    
        camera:{
            type:bind_camera,
            default:null
        },
        roomidLabel:{
            type:cc.Label,
            default:null,
        },
       levelLabel:{
            type:cc.Label,
            default:null,
        }
    },

    on_receive_addplayer_return:function(msg){ //添加玩家
        Obj_tool.createPrefeb("hero",function(heroPrafab){
            if(!heroPrafab){
                console.log("添加人物失败!")
                return
            }
            
            let heroObj  = cc.instantiate(heroPrafab)
            this.playerData[msg.uid] = heroObj
            let herojs = heroObj.getComponent("hero")
            heroObj.position = cc.p(msg.orginposx,msg.orginposy)
            this.node.addChild(heroObj,10000)
            herojs.setPlayerInfo(msg) 
            if(msg.state == 1){
                heroObj.setOpacity(100)
            }
            if(msg.uid == ugame.uid){
                this.camera.target = heroPrafab
            }
            this.playerData[msg.uid] = herojs
        }.bind(this))
    },
    on_receive_removePlayer_return:function(msg){  //移除玩家
        console.log("移除一个人")
        if(this.playerData[msg.uid]){
            this.playerData[msg.uid].removeFromParent()
            delete this.playerData[msg.uid]
        }
    },

    on_receive_disconnection_return:function(msg){  //玩家状态
        let player = this.playerData[msg.uid]
        if(player){
            switch(msg.m_flag){
                case  1 : //掉线
                    player.setOpacity(100)
                break;
                case 3: //回来了
                    player.setOpacity(255)
                break;
            }
        }
    },

    on_server_return_roominfo:function(msg){ //收到房间信息
        console.log("收到房间信息")
        this.PropJsonData = msg.PropJsonData
        this.maxHunger = msg.maxhunger
        this.subhunger = msg.subhunger
        this.DeskID = msg.roomid 
        this.level = msg.level


        this.roomidLabel.string = "房间号:" + this.DeskID
        this.levelLabel.string = "等级Lv" + this.level
    },

    start:function(){
        this.maxHunger = 0 //房间内的最大饥饿值
        this.DeskID = 0//当前房间号
        this.PropJsonData={}// {  config:{propID:1,hunger:10,Probability:90},  maxHunger:1000}
        this.playerData={}//当前房间所有玩家信息
        this.level = 1//当前房间的等级


        websocket.register_serivces_handler(MessageInit.addPlayer, this, this.on_receive_addplayer_return.bind(this))  //添加人
        websocket.register_serivces_handler(MessageInit.DisConnection, this, this.on_receive_disconnection_return.bind(this))  //有人断线
        websocket.register_serivces_handler(MessageInit.removePlayer, this, this.on_receive_removePlayer_return.bind(this))    //移除玩家
        websocket.register_serivces_handler(MessageInit.SCRoomInfo, this, this.on_server_return_roominfo.bind(this))           //房间信息

        let enterRoomMsg={}
        enterRoomMsg.m_msgId = MessageInit.enterGameScene 
        websocket.sendMessage(enterRoomMsg)
    }
})
 