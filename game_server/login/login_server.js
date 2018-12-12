const messageInfo = require("../socket/MessageInit.js")
const socketServer = require("../socket/socketServer.js")
const Login_db = require("../database/Login_db.js") 
const redis_server = require("../socket/redis_server.js") 
const server_manager = require("../socket/server_manager")
 
var login_server = {

    SUCESS:0,//成功
    HASPERSIONLOGINED:1,//有人已经登录了
    HASPERSIONSAMELOGIN:2,//有其他人登录你的账号 
    NOTTHISACOUNT:3,//没有这个账户 
    REGISTERERROR:4,//注册失败 

    checkAcount:function(session,unick,callfunc){ 
        let msg = {}
        msg.m_msgId = messageInfo.loginResult
        Login_db.get_userinfoByunick(unick,function(userData){
            if(userData.errcode){
                msg.errcode = userData.errcode
                session.send_encoded_cmd(msg)
                callfunc(false)
            } else if(userData.length<=0){
                // msg.errorcode = this.NOTTHISACOUNT
                // session.send_encoded_cmd(msg)
                // callfunc(false)
                this.register_acount(session,unick,callfunc)
            }
            else if(userData.length>=1){
                callfunc(userData)
            } 
        }.bind(this))
    },

    Login_guest:function(session,msg){ 
        if(!msg.m_unick) return
        this.checkAcount(session,msg.m_unick,function(userData){
            if(!userData) return 
            userData = userData[0]

            let msg = {}
            msg.m_msgId = messageInfo.loginResult
            msg.errcode = 0
            msg.uid=userData.uid
            msg.unick= userData.unick
            msg.uname=userData.uname
            msg.exp = userData.exp 
            session.send_encoded_cmd(msg)
            if(!server_manager.recordUinfo(session,userData.uid)){
                return
            } 
            redis_server.set_uinfo_inredis(msg.uid,userData)
        }) 
    },
    register_acount:function(session,unick,callfunc){
        if(!unick) return
        Login_db.guest_register(unick,function(resultData){ 
            let msg = {}
            msg.m_msgId = messageInfo.loginResult
            if (resultData.errcode)  { 
                msg.errcode = resultData.errcode
                session.send_encoded_cmd(msg)
                return
            } 
            if(resultData.affectedRows<1){
                msg.errcode = this.REGISTERERROR
                session.send_encoded_cmd(msg)
                return
            }
            Login_db.get_userinfoByunick(unick,function(userData){
                if(userData.errcode) return 
                callfunc(userData)
            })
        }) 
    },

    register_serivces_handler:function(){
		socketServer.register_serivces_handler(messageInfo.loginGame,this.Login_guest.bind(this))
    }
}

module.exports = login_server