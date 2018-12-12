// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        _isShow:false
    },
    onLoad () {
        this.title = this.node.getChildByName("title")
        this.des = this.node.getChildByName("des") 
        this.node.active = this._isShow;
    },

    // start () {

    // },
    show(title,des){
        this._isShow = true
        if(this.node){
            this.node.active = this._isShow
        }
        title = title ||  "提示"
        des = des || ""
        this.title = title
        this.des = des
    },

    hide(){
        this._isShow = false
        if(this.node){
            this.node.active = this._isShow
        }
    }
    // update (dt) {},
});
