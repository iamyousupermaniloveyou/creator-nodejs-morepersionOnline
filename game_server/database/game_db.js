const mysql = require("mysql")
const util = require("util")
const log = require('../utils/log');
const MessageInit = require("../socket/MessageInit")

function tellCallBack(DbData,err,errinfo,callBack){
    switch(err){
        case MessageInit.DataBaseExeERROR:
            log.error("数据库执行语句有问题",errinfo)
        break

        case MessageInit.DataBaseOpenERROR:
            log.error("数据库打开失败",errinfo)
        break
 
    }
    err ? callBack({errcode:err}) : callBack(DbData)
}

var dbPool = null
function initWithConfig(dbip,dbPort,_user,pword,dbname,isdebug){
    dbPool = mysql.createPool({
        host:dbip,
        port:dbPort,
        user:_user,
        password:pword,
        database:dbname,
        debug:isdebug,
    }) 
} 

function exeSqlCmd(sqlcmd,callfunc){
    if(!dbPool) {
        log.warn("请先初始化game数据库")
        tellCallBack(null,MessageInit.DataBaseOpenERROR,null,callfunc)
        return
    }
    dbPool.getConnection(function(err, connection) {
        if (err){
            log.error("数据库连接有问题",err)
            tellCallBack(null,MessageInit.DataBaseOpenERROR,err,callfunc)
            return;
        };   
        // Use the connection
        connection.query(sqlcmd, function (error, results, fields) {
            connection.release();
            if (error){
                log.error("数据库执行语句有问题",err)
                tellCallBack(null,MessageInit.DataBaseExeERROR,error,callfunc)
                return
            }
            if(callfunc){
                tellCallBack(results,null,null,callfunc)
            }
        });
      });
}

function get_roominfo_with_roomid(roomid,callback){
    let sqlcmd = "select * from roominfo where roomid = %d"
    this.exeSqlCmd(util.format(sqlcmd,roomid),callback)
}

function get_roominfo_with_uid(uid,callback){
    let sqlcmd = "select * from roominfo where uid1=%d or uid2=%d or uid3=%d or uid4=%d or uid5=%d"
    this.exeSqlCmd(util.format(sqlcmd,uid,uid,uid,uid,uid),callback)
}

function getEmptyRoom(callback){
    let sqlcmd = "select * from roominfo where uid1=0 or uid2=0 or uid3=0 or uid4=0 or uid5=0"
    this.exeSqlCmd(sqlcmd,callback)
}

function getMaxroomId(callback){
    let sqlcmd = "select max(roomid) as roomid from roominfo"
    this.exeSqlCmd(sqlcmd,callback)
}

function insert_into_roominfo(roomid,level,maxhunger,_subhunger,callback){ 
    this.get_roominfo_with_roomid(roomid,function(roomdata){
        if(roomdata.errcode) return
        if(roomdata.length>0){
            tellCallBack(roomdata,null,"没有获得房间数据",callback)
            log.info("已经存在房间",roomid,"不能再创建这个房间")
            return
        } 
        level = level || 1
        let sqlcmd = "insert into roominfo(roomid,level,maxhunger,subhunger) values(%d,%d,%d,%d)"
        this.exeSqlCmd(util.format(sqlcmd,roomid,level,maxhunger,_subhunger),callback)
    }.bind(this))
}

function update_roominfo_Byroomid_uid_seatIdx(roomid,uid,seatIdx,callback){   
    let sqlcmd = "update roominfo set uid%d =%d where roomid=%d"
    this.exeSqlCmd(util.format(sqlcmd,seatIdx,uid,roomid),callback)
}

function update_info_pos(callback,roomid,posx,posy){
    posx=posx || 400 
    posy=posy || 400 
    // let sqlcmd = "update roominfo set posx=%f,posy=%f where roomid=%d"
    // this.exeSqlCmd(util.format(sqlcmd,posx,posy,roomid),callback)
}

function update_info_hunger_ByseatIdx(callback,roomid,hunger,seatIdx){ 
    // let sqlcmd = "update roominfo set lasthunger%d=%f where roomid=%d"
    // this.exeSqlCmd(util.format(sqlcmd,seatIdx,hunger,roomid),callback)
}
 
module.exports={
    initWithConfig:initWithConfig,

    exeSqlCmd:exeSqlCmd,
    getEmptyRoom:getEmptyRoom,
    getMaxroomId:getMaxroomId,
    insert_into_roominfo:insert_into_roominfo, 
    update_info_hunger_ByseatIdx:update_info_hunger_ByseatIdx,
    update_info_pos:update_info_pos,
    update_roominfo_Byroomid_uid_seatIdx:update_roominfo_Byroomid_uid_seatIdx,
    get_roominfo_with_roomid:get_roominfo_with_roomid,
    get_roominfo_with_uid:get_roominfo_with_uid, 
}