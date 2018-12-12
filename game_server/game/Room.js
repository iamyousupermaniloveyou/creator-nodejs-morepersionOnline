const game_db = require("../database/game_db.js")
const MessageInit = require("../socket/MessageInit.js") 
const Player = require("./player.js") 
  
var table={}
table.nums = function(t,f){
    let count = 0
    if(f){  
        let keys = Object.keys(t)
       if(f(t[keys[count]],keys[count]))  
         count += 1
    }else {
        for (const key in t) {
            count = count + 1
        }
    }
    return count
}

var autoinc_roomid = 0
var maxPerionCount = 5
var room_info={}//{roomid:{roomid:1111,players:{}},{roomid:2222,players:{}}}

function Room(){
    this.roomid = 0 
    this.uid = {}
    this.posx = 0 
    this.posy = 0 
    this.maxhunger = 10000
    this.level = 1
    this.subhunger = 10

    this.players = []
    this.autoinc_roomid = 0 
    this.maxPerionCount = 5 
}

Room.prototype.init = function(roominfo){ 
    this.roomid = roominfo.roomid
    this.uid[1] = roominfo.uid1
    this.uid[2] = roominfo.uid2
    this.uid[3] = roominfo.uid3
    this.uid[4] = roominfo.uid4 
    this.uid[5] = roominfo.uid5
 
    this.posx = roominfo.posx 
    this.posy = roominfo.posy  
    this.maxhunger = roominfo.maxhunger
    this.level = roominfo.level
    this.subhunger = roominfo.subhunger
}

Room.prototype.init_roominfo = function(roomid,callfunc){ //使用新的房间号，创建一个房间
    let self = this
    game_db.insert_into_roominfo(roomid,self.level,self.maxhunger,self.subhunger,function(result){
        if(result.errcode){ return }  
        if(result.affectedRows && result.affectedRows >0){
            game_db.get_roominfo_with_roomid(roomid,function(roomData){
                if(roomData.errcode){  
                    callfunc(false)
                    return
                }
                if(roomData.length>0){ 
                    self.init(roomData[0])
                    callfunc(true)
                    return
                } 
            })
        }
        else{
            if(result.length>0){ 
                self.init(result[0])
                callfunc(true)
                return
            }  
        }
    })
}

Room.prototype.getEmptySeat = function(){
    for (const seatIdx in this.uid) { 
        let uid = this.uid[seatIdx]
        if(uid==0){
            return parseInt(seatIdx) //seatidx 1 , 2, 3, 4
        }
    }
    return -1
}

Room.prototype.isExistuid = function(uid){
    for (const seatIdx in this.uid) {
        if (this.uid[seatIdx] == uid) {
            return seatIdx
        }
    }
    return false
}
 
Room.prototype.PlayerSitDown = function(player,callfunc){
    let seatIdx = this.isExistuid(player.uid)
    if(!seatIdx) 
        seatIdx = this.getEmptySeat()
    if(seatIdx == -1)  {
        console.log("没有找到空的座位号，所以玩家坐下失败")
        return
    }
    this.PlayerSitDownSeatIdx(player,seatIdx,callfunc)
}

Room.prototype.PlayerSitDownSeatIdx = function(player,seatIdx,callfunc){
    game_db.update_roominfo_Byroomid_uid_seatIdx(this.roomid,player.uid,seatIdx,function(result){
        if(result.errcode){
            callfunc(false)
            return
        } 
        this.addPlayer(seatIdx,player)
        player.setSeatIdx(seatIdx)
        this.uid[seatIdx] = parseInt(player.uid)
        callfunc(true)
    }.bind(this))
}

Room.prototype.addPlayer = function(seatIdx,player){
    this.players[seatIdx] = player
}

Room.prototype.synchronous = function(callfunc){
    let sysnnum = table.nums(this.uid)
    for (let seatIdx in this.uid) { 
        if(this.uid[seatIdx] == 0) {
            sysnnum -= 1 
        }else {
            let player = this.players[seatIdx]
            if(!player){ 
                player = new Player()
                player.state = 1
                player.init_uinfo(this.uid[seatIdx],function(issucess){
                    sysnnum -= 1
                    if(!issucess) 
                    {
                        this.deletePlayerByuid(this.uid[seatIdx])
                        if(sysnnum ==0){
                            callfunc(true)
                        }
                        return
                    }
                    this.addPlayer(seatIdx,player)
                    if(sysnnum ==0){
                        callfunc(true)
                    }
                }.bind(this))
            } else {
                sysnnum -= 1
            }
        }
    }
    if(sysnnum ==0){
        callfunc(true)
    }
} 

Room.prototype.getPlayerinfoByseatIdx = function(seatIdx){
    return this.players[seatIdx]
}

Room.prototype.getPlayerinfoByuid = function(uid){
    let seatIdx = this.isExistuid(uid)
    if(!seatIdx) return null
    return this.getPlayerinfoByseatIdx(seatIdx)
}

// status 0 掉线  1 回来了
Room.prototype.onRcvOffLineState = function(uid,status) {
   for(const key in this.players){
       let player = this.players[key]
        if(player){ 
            player.onRcvOffLineState(status)
            let msgTbl = {}
            msgTbl.m_msgId = MessageInit.DisConnection
            msgTbl.m_flag = status
            msgTbl.uid = uid
            player.send_cmd(msgTbl)
        }    
    }
} 

Room.prototype.deletePlayerByuid = function(uid,callfunc){
    let seatIdx = this.isExistuid(uid)
    if(!seatIdx) return
    game_db.update_roominfo_Byroomid_uid_seatIdx(this.roomid,0,seatIdx,function(result){
        if(result.errcode){
            if(callfunc)
                callfunc(false)
            return
        }
        let player = this.getPlayerinfoByseatIdx(seatIdx)
        if(player){
            player.exitRoom()
        }
        this.players[seatIdx] = null
        this.uid[seatIdx] = 0
    }.bind(this))
} 


module.exports = Room