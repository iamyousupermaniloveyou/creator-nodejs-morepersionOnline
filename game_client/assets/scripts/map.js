// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad () {
        this.node.on('touchstart', this.onEventStart, this);
        this.node.on('touchmove', this.onEventMove, this);
        this.node.on('touchend', this.onEventEnd, this);
        this.node.on('touchcancel', this.onEventCancel, this); 
    },

    onEventStart:function(touch,event){ 
        console.log("点击了")
        let origworldPoint = touch.getLocation(); 
        let camera = cc.find('Canvas/camera').getComponent(cc.Camera); 
        let hero = cc.find('Canvas/hero').getComponent(cc.Node);
        hero.active = false
        // let herojs = cc.find('Canvas/hero').getComponent("hero");

        // let touchLocation = camera.getCameraToWorldPoint(origworldPoint);
        // let subab = hero.parent.convertToNodeSpaceAR(touchLocation) 
        // if(Math.abs(subab.x-hero.x)<40 && subab.y>hero.y){
        //     herojs.jump()
        // }
        // else {
        //     if(subab.x-hero.x <0){
        //         hero.input_flag = -1;
        //     }
        //     else{
        //         hero.input_flag = 1;
        //     }
        // }
    },
    onEventMove:function(touch){   
        // let origworldPoint = touch.getLocation(); 
        // let camera = cc.find('Canvas/camera').getComponent(cc.Camera);
        // let hero = cc.find('Canvas/hero').getComponent(cc.Node);
        // let herojs = cc.find('Canvas/hero').getComponent("hero");
        // let touchLocation = camera.getCameraToWorldPoint(origworldPoint);
        // let subab = hero.parent.convertToNodeSpaceAR(touchLocation) 
        // if(Math.abs(subab.x-hero.x)>40){
        //     if(subab.x-hero.x <0){
        //         herojs.input_flag = -1;
        //     }
        //     else{
        //         herojs.input_flag = 1;
        //     }
        // }
    },
    onEventCancel:function(event){
        // let herojs = cc.find('Canvas/hero').getComponent("hero");
        // herojs.input_flag = 0
    },
    onEventEnd:function(event){
        // let herojs = cc.find('Canvas/hero').getComponent("hero");
        // herojs.input_flag = 0
    },
    // update (dt) { 
    // },
});
