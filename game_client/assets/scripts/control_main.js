// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var _control_type_ = require("./control_type.js") 
var hero = require("./hero.js")
var ugame = require("./utilTools/ugame.js")
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
        hero_js:{
            type:hero,
            default:null
        },
        hunger_MaxNum= 30,
        hunger_Speed = 1,//每分钟(60s)消耗一条鱼
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () { 
        this.starthunger_time = 0
    },

    start () {
        this.buyu_btn = this.node.getChildByName("Btn_player_diaoyu")
        this.buyu_btn.active = false
        this.btn_des = this.buyu_btn.getChildByName("Label")

        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this;
        eventHandler.component = "control_main";
        eventHandler.handler = "OnClick";
        eventHandler.customEventData = "12";
        var but = this.buyu_btn.getComponent(cc.Button)
        but.clickEvents.push(eventHandler)


        this.fileLabel = this.node.getChildByName("fishnum").getComponent(cc.Label)
        this.fileLabel.string = "x " + ugame.get_fish_num().toString()

        this.slider_hunger = cc.node.getChildByName("hunger_slider")
        this.slider_hunger.progress = 0
    },

    OnClick(e,d){ 
        this.hero_js.hookFish(function(fishnum){
            this.addFishCount(fishnum)
        }.bind(this))
    },

    addFishCount:function(num){
        var cunum =  parseInt(ugame.get_fish_num()) + num
        this.fileLabel.string = "x " + cunum.toString()
        ugame.save_fish_num(cunum) 
    },

    HeroEatFish:function(){
        let fish_num = parseInt(ugame.get_fish_num())
        let provalue = fish_num/this.hunger_MaxNum
        this.slider_hunger.progress = provalue>1 && 1 || provalue
    },

    setBtnVisible : function(_isbuyu){
        if(this.hero_js.node.scaleX>0){
            this.buyu_btn.active = false
            return
        }
        switch(_isbuyu){
            case _control_type_.buyu:
                this.buyu_btn.active = true
            break;
            default :
                this.buyu_btn.active = false
            break
        }
    },

    update (dt) {
        //没一段时间消耗一条鱼
        this.starthunger_time = this.starthunger_time + dt
        if(this.starthunger_time - this.hunger_Speed*60 > 0){
            this.starthunger_time = this.starthunger_time - this.hunger_Speed*60
            let fish_num = parseInt(ugame.get_fish_num()) - 1
            ugame.save_fish_num(fish_num) 
            this.HeroEatFish()
        }
    },
});
