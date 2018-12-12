var control_main = require("./control_main.js")
var _control_type_ = require("./control_type.js")
var hero = require("./hero.js")
var ugame = require("./utilTools/ugame.js")

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
        control_type :1,
        col_main:{
            type:control_main,
            default:null
        },
    },

    onLoad:function(){ 
        this.control_type = _control_type_.buyu
    },

    // use this for initialization
    // update: function () { 
    // },

    onCollisionEnter: function (other, self) { 
        console.log(other.node.name,self.node.name ,"enter")
        if(this.control_type == _control_type_.buyu){
            this.col_main.setBtnVisible(this.control_type)
        }
    },

    // 碰撞持续
    onCollisionStay: function (other, self) {
    },
    // end 

    // 碰撞结束
    onCollisionExit: function (other, self) { 
        this.col_main.setBtnVisible()
    },
});