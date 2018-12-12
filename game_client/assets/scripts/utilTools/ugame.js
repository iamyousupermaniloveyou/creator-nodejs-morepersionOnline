var utils = require("./utils.js");
var ugame = {
    fish_num:0,
    game_over:true,
    unick : "",
    uname:"",
    uid:-1,
    exp:0,
    save_fish_num:function(_fish_num_){
        cc.sys.localStorage.setItem("_FISH_NUM_",_fish_num_)
    },
    get_fish_num:function(){
        this.fish_num = cc.sys.localStorage.getItem("_FISH_NUM_")
        if(!this.fish_num){
            this.fish_num = 0
        }
        return parseInt(this.fish_num)
    },

    save_nick:function(_nick_){
        this.unick = _nick_
        cc.sys.localStorage.setItem("_PLAYER_NICK_",_nick_)
        console.log("存储",_nick_)
    },

    get_nick:function(){
        if(this.unick){
            return this.unick
        }
        let nick = cc.sys.localStorage.getItem("_PLAYER_NICK_")
        if(nick){
            return nick
        }
        nick = "guest_" + utils.random_string(4);
        return nick
    },

    set_uinfo:function(config){
        console.log("设置配置")
        this.exp = config.exp
        this.uid = config.uid
        this.unick = config.unick
        this.uname = config.uname
        this.save_nick(this.unick)
    }
}
module.exports = ugame;