// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var websocket = require("./socket/websocket")
const MessageInit = require("./socket/MessageInit.js")
const ugame = require("./utilTools/ugame.js")
var Obj_tool = require("./utilTools/Obj_tools.js")

var LOGINSTATE ={
    0:"登录成功",
    1:"有人已经登录了",
    2:"有其他人登录你的账号 ",
    3:"没有这个账户 ",
    4:"注册失败",
}

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        guest_input:{
            type:cc.EditBox,
            default:null,
        }
    }, 

    login_game:function(){
        let acount = this.guest_input.string
        if(acount.trim().length<=0)
            acount =ugame.get_nick()
        let loginmsg = {
            m_msgId : MessageInit.loginGame,
            m_unick :  acount
        }
        websocket.connectServer()
        websocket.sendMessage(loginmsg)
        Obj_tool.showLoadingTips("请稍等，正在登录...")
    },

    on_receive_server_return:function(msg){
        Obj_tool.removeLoadingTips() 
        switch(msg.errcode){
            case 0:
                ugame.set_uinfo(msg)
                websocket.removeTargetEventListenerByType(this,MessageInit.loginResult)
                websocket.removeTargetEventListenerByType(this,MessageInit.SOCKETSTATE)
                        
                cc.loader.onProgress = function(completeCount,totalCount,item){
                    // console.log("completeCount,totalCount",completeCount,totalCount)
                }
                
                cc.director.preloadScene("game_scene",function(error){
                    if(error) return
                    cc.director.loadScene("game_scene")
                }) 
            break; 
            case 4:
                Obj_tool.showNoticeTips("提示",LOGINSTATE[4])
            break;
        } 
    },


    on_receive_loginState:function(msg){ 
        Obj_tool.removeLoadingTips() 
        switch(msg.errorCode){
            case 0:
            break
            case 1:
                Obj_tool.showNoticeTips("提示","已经有人登录了")
            break
            case 2:
                Obj_tool.showNoticeTips("提示","有其他人登录你的账号,请注意账号安全！！！")
            break;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start:function() {
        // websocket.initWithSocketData("","")
        cc.director.setDisplayStats(false) 
        websocket.register_serivces_handler(MessageInit.loginResult, this, this.on_receive_server_return.bind(this))
        websocket.register_serivces_handler(MessageInit.SOCKETSTATE, this, this.on_receive_loginState.bind(this))
    },

    // update (dt) {},
});
