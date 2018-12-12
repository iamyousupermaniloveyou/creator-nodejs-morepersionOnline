// 键盘,水平移动,左右
// 跳跃为空给
var Obj_tool = require("./utilTools/Obj_tools.js")
var ugame = require("./utilTools/ugame.js")
var ugame = require("./utilTools/ugame.js")

function random(lower, upper) {
	return Math.floor(Math.random() * (upper - lower)) + lower;
} 

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        body: {
            type: cc.RigidBody,
            default: null,
        },
    },
    start:function(){
        this.uid=0 
        this.name=""
        this.hp=0 
    },
    // use this for initialization
    onLoad:function () { 
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.on_key_down.bind(this), this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.on_key_up.bind(this), this); 

        this.heroname = this.node.getChildByName("name").getComponent(cc.Label)
        this.heroname.string = "123"

        this.hunger = this.node.getChildByName("hp").getComponent(cc.ProgressBar)
        this.hunger.progress = 0
        
        this.hook = this.node.getChildByName("hook")
        this.hook.active = false

        this.input_flag = 0;

        this.hookfishing = false
        this.heroOriginPoint = this.node.position
    },

    jump: function() {
        var v = this.body.linearVelocity;
        v.y = 600;
        this.body.linearVelocity = v;
    },

    // -1, 1
    walk: function(dir) {
        var v = this.body.linearVelocity;
        v.x = 200 * dir;
        this.body.linearVelocity = v;
        this.node.scaleX = dir;
    },

    death:function(isRelive){
        if(isRelive){
            this.resetInfo()
        }
        else{
            Obj_tool.showNoticeTips("失败","生存游戏结束")
        }
    },

    on_key_down: function(e) {
        switch(e.keyCode) {
            case cc.KEY.left:
                this.input_flag = -1;
            break;
            case cc.KEY.right:
                this.input_flag = 1;
            break;

            case cc.KEY.space:
                this.jump();
            break;
        }
    },

    on_key_up:function(e) {
        switch(e.keyCode) {
            case cc.KEY.left:
                this.input_flag = 0;
            break;
            case cc.KEY.right:
                this.input_flag = 0;
            break;
            case cc.KEY.space:
            break;
        }
    },  

    //钓鱼
    hookFish(callback){
        console.log("准备钓鱼")
        var maxroud  = random(1,3)
        var curround = 0
        if (this.hookfishing){
            console.log("你已经正在钓鱼了")
            return
        }

        this.hookfishing = true
        this.hook.active = true;
        var scal = cc.scaleTo(1,-1,2)
        var scalb = cc.scaleTo(1,-1,1)
        var cb = cc.callFunc(function(){
            curround = curround + 1
            if(curround>=maxroud){
                Obj_tool.showNoticeTips("提示","恭喜你获得一条鱼")
                if(callback){
                    callback(1)
                }
                this.stophookFish()
            }
        }.bind(this))
        var seqever = cc.repeatForever(cc.sequence(scal,scalb,cb))
        this.hook.runAction(seqever)
    },
    //停止钓鱼
    stophookFish(){
        this.hookfishing = false
        this.hook.active = false; 
        this.hook.stopAllActions()
    },

    resetInfo:function(){
        this.node.position = this.heroOriginPoint
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.input_flag !== 0) {
            this.walk(this.input_flag);
        }

        if(this.node.y<-640/2){
            this.resetInfo()
        }
    },

//------------playerinfo--------------------
    setPlayerInfo:function(config){
        this.uid = config.uid
        this.name = config.uname 
        this.hunger = config.hunger
        // this.setHeroHp(this.hp)
        this.setName(this.name)
    },

    setName:function(name){ //设置名字
        this.heroname.string = name 
    },

    setHeroHp:function(hp){ //这个是百分比的设置血量
        this.hunger.progress = hunger
    }
});
 