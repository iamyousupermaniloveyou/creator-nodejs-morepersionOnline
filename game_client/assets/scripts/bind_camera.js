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
        target: {
            default: null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.target === null) {
            return;
        }
        // target到哪里, camera跟到哪里
        // var wpos = this.target.convertToWorldSpaceAR(cc.p(0, 0));
        // var pos = this.node.convertToNodeSpaceAR(wpos);
 
        if(this.node.x>(3200 - 960/2)){
            return 
        }
        if(this.node.x<960/2){
            return
        }
        this.node.x =   this.target.x  
        // this.node.setPosition(pos);
        // this.node.x = pos.x;
    },
});
