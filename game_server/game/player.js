
const redis_server = require("../socket/redis_server.js")
const login_db = require("../database/Login_db.js") 
const messageInfo = require("../socket/MessageInit.js")
 
function Player(){
    this.STATE= {
        DISCONNECTION:1,  //断线
        DEAY :2,          //死亡
        LIVE:3             //游戏中
    }

    this.uid = 0
    this.exp = 0
    this.nick = ""
    this.name = ""
    this.lasthunger = 0
    this.seatIdx = 0
    this.state = this.STATE.LIVE
    this.posx = 0 
    this.posy = 0

    this.session = null
}

Player.prototype.init = function(uinfo){
    this.uid = parseInt(uinfo.uid)
    this.nick = uinfo.unick
    this.uname = uinfo.uname
    this.exp = parseInt(uinfo.exp)
    this.lasthunger = parseInt(uinfo.lasthunger)
    this.posx = parseInt(uinfo.posx)
    this.posy = parseInt(uinfo.posy)
}

Player.prototype.init_uinfo_redis = function(uid,callfunc){
    redis_server.get_uinfo_inredis(uid,function(pinfo){
        if(pinfo && pinfo.uid){ 
            this.init(pinfo)
            callfunc(true)
            return 
        }
        callfunc(false)
    }.bind(this)) 
}


Player.prototype.init_uinfo_mysql = function(uid,callfunc){
    login_db.get_userinfoByuid(uid,function(userData){
        if(userData.length<=0) return
        userData = userData[0]
        if(userData && userData.uid){ 
            this.init(userData)
            callfunc(true)
            return 
        }
        callfunc(false)
    }.bind(this)) 
}

Player.prototype.init_uinfo = function(uid,callfunc){
    this.init_uinfo_redis(uid,function(issucess){
        if(!issucess){
            this.init_uinfo_mysql(uid,function(issqlSucess){
                if(!issqlSucess){
                    callfunc(false)
                } else {
                    callfunc(true)
                }
            })
        } else {
            callfunc(true)
        }
    }.bind(this))
}

Player.prototype.setSeatIdx = function(seatIdx){
    this.seatIdx = seatIdx
}

Player.prototype.setSession = function(session){
    this.session = session
}

Player.prototype.exitRoom = function(){
    this.seatIdx = 0
}

Player.prototype.destoryMyself = function(){

}

Player.prototype.send_myinfo_to_player = function(player){ 
    let msgTbl = {} //通知添加玩家
    msgTbl.m_msgId = messageInfo.addPlayer 
    msgTbl.uid = this.uid 
    msgTbl.uname = this.nick 
    msgTbl.orginposx= this.posx
    msgTbl.orginposy= this.posx
    msgTbl.seatIdx = this.seatIdx
    msgTbl.hunger = this.lasthunger
    msgTbl.state = this.state 
    player.send_cmd(msgTbl)
}

Player.prototype.send_cmd = function(msg){
    if(this.session && this.session.is_connected){
        this.session.send_encoded_cmd(msg)
    }
}

Player.prototype.send_online_cmd = function(uid){
    let msgTbl = {}
    msgTbl.m_msgId = messageInfo.DisConnection
    msgTbl.m_flag =  this.STATE.LIVE
    msgTbl.uid = uid
    this.send_cmd(msgTbl)
}

Player.prototype.send_disline_cmd = function(uid){
    let msgTbl = {}
    msgTbl.m_msgId = messageInfo.DisConnection
    msgTbl.m_flag =  this.STATE.DISCONNECTION
    msgTbl.uid = uid
    this.send_cmd(msgTbl)
}


module.exports = Player