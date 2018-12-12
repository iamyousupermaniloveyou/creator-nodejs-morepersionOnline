
const log = require('../utils/log');
const socketServer = require("./socketServer.js")
const MessageInit = require("./MessageInit.js") 

var table={}
table.nums = function(t){
    let count = 0
    for (const key in t) {
        count = count + 1
    }
    return count
}

var server_manager={
    gloab_server : {},
    isSqueezeout :false,//是否可以把上一个账号挤出

    DisConnection:function(session){ 
        for (const uid in this.gloab_server) { 
            if(this.gloab_server[uid] == session){ 
                delete this.gloab_server[uid]
                console.log("剩余在线人数",table.nums(this.gloab_server))
                return
            }
        }
    },

    enterConnection:function(session,uid){
        this.gloab_server[uid] = session
        session.uid = uid
        console.log("在线人数",table.nums(this.gloab_server))
    },

    recordUinfo:function(session,uid){
        const login_server = require("../login/login_server.js")
        let islogined = this.isLogin_by_UID(uid)
        if(islogined){
            if(this.isSqueezeout){ //如果可以被挤掉
                let presocket = islogined
                let msgToSend = {}
                msgToSend.m_msgId = MessageInit.SOCKETSTATE
                msgToSend.errorCode = login_server.HASPERSIONSAMELOGIN
                presocket.send_encoded_cmd(msgToSend)
                presocket.close()
            }
            else{ //如果不能被挤掉，告诉他，并直接返回，不做处理
                let msgToSend = {}
                msgToSend.m_msgId = MessageInit.SOCKETSTATE
                msgToSend.errorCode = login_server.HASPERSIONLOGINED
                session.send_encoded_cmd(msgToSend)
                session.close() 
                return false
            }
        }

        this.enterConnection(session,uid)
        return true
    },

    isLogin_by_UID:function(uid){
        if(this.gloab_server[uid])
            return this.gloab_server[uid]
        else
            return false
    }
}
socketServer.register_serivces_handler(MessageInit.DisConnection,server_manager.DisConnection.bind(server_manager))


module.exports = server_manager