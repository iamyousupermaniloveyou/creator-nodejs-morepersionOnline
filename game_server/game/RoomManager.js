
const Room = require("./Room.js") 
const Player = require("./player.js") 
const game_db = require("../database/game_db.js")

var RoomManager = {
    roominfo : {}, //{roomid = 1}
    addPlayer:function(session,uid,callfunc){ 
        let self  = this
        game_db.get_roominfo_with_uid(uid,function(roomData){
            if(roomData.errcode) return 
            let room = null
            let seatIdx = 0
            let player = new Player()
            player.setSession(session)

            if(roomData.length>0){ //断线重连进来的
                roomData = roomData[0]
                console.log("使用已经存在的房间号",roomData.roomid)
                room = self.roominfo[roomData.roomid]
                if(!room){ //如果没有房间，1创建房间
                    room = new Room()
                    room.init(roomData)
                    self.roominfo[roomData.roomid] = room
                } 

                if(room.getPlayerinfoByuid()) {
                    player = room.getPlayerinfoByuid()
                    player.setSession(session)
                } else {
                    player = new Player()
                    player.setSession(session)
                }

                player.init_uinfo(uid,function(issucess){
                    if(!issucess) return 
                    seatIdx = room.isExistuid(uid)
                    room.addPlayer(seatIdx,player)
                    room.synchronous(function(){
                        callfunc(player,room,false)
                    })
                }) 
            } else{ //新加入的玩家 
                self.getEmptyRoom(function(_nexroom_,isNew){
                    if(isNew) {
                        self.roominfo[_nexroom_.roomid] = _nexroom_ 
                    }
                    player.init_uinfo(uid,function(issucess){
                        if(!issucess) return  
                        _nexroom_.PlayerSitDown(player,function(issucess){
                            if(!issucess) return 
                            callfunc(player,_nexroom_,true)
                        }) 
                    }) 
                })
            }
        })
    },

    //返回一个空房间 和 是否新创建的
    getEmptyRoom:function(callfunc){
        let emptyroom = null
        for (const key in this.roominfo) { 
            emptyroom = this.roominfo[key].getEmptySeat()
            if(emptyroom != -1){
                callfunc(this.roominfo[key],false)
                return
            }
        } 
        emptyroom = new Room()
        this.getNextMaxroomId(function(maxroomid){
            let nexroomid = maxroomid + 1
            emptyroom.init_roominfo(nexroomid,function(issucess){
                if(!issucess) return
                callfunc(emptyroom,true)
            })
        }) 
    } ,

    getRoomByuid:function(uid){
        for (const roomid in this.roominfo) { 
            let room = this.roominfo[roomid]
            let player = room.getPlayerinfoByuid(uid) 
            return player ? room : null
        }
        return null
    },

    getNextMaxroomId:function(callfunc){
        game_db.getMaxroomId(function(roomids){
            if(roomids.errcode) return
            let roomid = 0
            if(!roomids[0].roomid){
                roomid = 1 
            }else {
                roomid = roomids[0].roomid 
            }
            callfunc(roomid) 
        })
    },

    delete_room_player:function(roomid,uid,callfunc){
        let room = this.roominfo[roomid]
        if(room){
            room.deletePlayerByuid(uid,callfunc)
        }
    },

    ////net 
    board_room_playerinfo:function(myself,roomid,isnew){
        let room = this.roominfo[roomid]
        for (const seatIdx in room.players || []) { 
            let player = room.players[seatIdx]
            if(player.uid != myself.uid){
                if(isnew){
                    player.send_myinfo_to_player(myself)
                    myself.send_myinfo_to_player(player)
                }  
                else{
                    player.send_myinfo_to_player(myself)
                    player.send_online_cmd(myself.uid)
                }

            }
        } 
    },

    board_room_playeronline:function(uid){
        let room = this.getRoomByuid(uid)
        if(!room) return
        for (const key in room.players) { 
            let player = room.players[key]
            if(player.uid == uid){
                player.state= player.STATE.LIVE
                continue
            }
            player.send_online_cmd(uid)
        }
    },

    board_room_playerdisline:function(uid){
        let room = this.getRoomByuid(uid)
        if(!room) return
        for (const key in room.players) { 
            let player = room.players[key]
            if(player.uid == uid){
                player.state= player.STATE.DISCONNECTION
                player.setSession(null)
                continue
            }
            player.send_disline_cmd(uid)
        }
    }

}

module.exports = RoomManager