const mysql = require("mysql")
const util = require("util")
const MessageInit = require("../socket/MessageInit")
const log = require('../utils/log');

function tellCallBack(DbData,err,callBack){
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
    self = this
    if(!dbPool) {
        log.warn("请先初始化login数据库")
        tellCallBack(null,MessageInit.DataBaseOpenERROR,callfunc)
        return
    }
    dbPool.getConnection(function(err, connection) {
        if (err){
            log.error("数据库连接有问题",err)
            setTimeout(() => {
                self.exeSqlCmd(sqlcmd,callfunc)
            }, 3000);
            // tellCallBack(null,MessageInit.DataBaseOpenERROR,callfunc)
            return;
        };  
        // Use the connection
        connection.query(sqlcmd, function (error, results, fields) {
            connection.release();
            if (error){
                    log.error("数据库执行语句有问题",error)
                    tellCallBack(null,MessageInit.DataBaseExeERROR,callfunc)
                    return
            }
            if(callfunc){
                tellCallBack(results,null,callfunc)
            }
        });
      });
}

function guest_login(unick,callfunc){ 
    this.get_userinfo(unick,function(userData){
        if(userData){
            if(userData.length>0)
                callfunc(userData)
            else{
                this.guest_register(unick,callfunc) 
                this.get_userinfo(unick,callfunc)
            }
        }
    }.bind(this))
}

function get_userinfoByunick(unick,callfunc){ 
    let sqlcmd = util.format("select * from playerinfo where unick='%s'",unick)
    this.exeSqlCmd(sqlcmd,callfunc)
}

function get_userinfoByuid(uid,callfunc){ 
    let sqlcmd = util.format("select * from playerinfo where uid='%s'",uid)
    this.exeSqlCmd(sqlcmd,callfunc)
}

function guest_register(unick,callfunc){
    let sqlcmd = util.format("insert into playerinfo(unick) values('%s')",unick)
    this.exeSqlCmd(sqlcmd,callfunc)
}

module.exports={
    exeSqlCmd:exeSqlCmd,
    initWithConfig:initWithConfig,

    guest_login:guest_login,
    get_userinfoByunick:get_userinfoByunick,
    get_userinfoByuid:get_userinfoByuid,
    guest_register:guest_register,
}