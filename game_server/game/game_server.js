const messageInfo = require("../socket/MessageInit.js")
const socketServer = require("../socket/socketServer.js") 
const prop_config = require("./prop_config.js")
const redis_server = require("../socket/redis_server.js")
const log = require("../utils/log.js") 
const RoomMamager = require("./RoomManager.js")


var table={}
table.nums = function(t){
    let count = 0
    for (const key in t) {
        count = count + 1
    }
    return count
}

var room_buffer = [] 

var game_server = { 
    cleanRoomInfoBy_RoomId_With_Uid:function(roomid,uid){
        let playerData = room_info[roomid]
        if(playerData){
            for (const index in playerData) {
                let playerinfo = playerData[index]
                if(playerinfo.uid && playerinfo.uid == uid){
                    delete playerData[index]
                }
            }
        }
    },

    PlayerEnterGame:function(session,msg){  //将玩家加入房间
        if(!session.uid) return 
        RoomMamager.addPlayer(session,session.uid,function(player,room,isnew){
            console.log("创建房间成功")
            let msgTbl = {}
            msgTbl.m_msgId = messageInfo.SCRoomInfo
            msgTbl.PropJsonData = prop_config[1]
            msgTbl.maxhunger = room.maxhunger
            msgTbl.subhunger = room.subhunger
            msgTbl.roomid = room.roomid
            msgTbl.level = room.level
            player.send_cmd(msgTbl)
            console.log("已经发送了房间信息")

            player.send_myinfo_to_player(player)
            console.log("已经发送了我的个人信息")
            RoomMamager.board_room_playerinfo(player,room.roomid,isnew)
            console.log("已经发送了广播信息")
        })
    },
 
    PlayerExistRoom:function(uid){  //将玩家加入房间
        console.log("删除人",uid)  
        for (const key in room_buffer) {
            room_buffer[key].deletePlayerByuid(uid) 
        } 
    },

    DisConnection:function(session){
        if(session.uid){
            RoomMamager.board_room_playerdisline(session.uid)  
        }

    },

    register_serivces_handler:function(){ 
		socketServer.register_serivces_handler(messageInfo.enterGameScene,this.PlayerEnterGame.bind(this))
        socketServer.register_serivces_handler(messageInfo.DisConnection,this.DisConnection.bind(this))
    }
}

module.exports = game_server