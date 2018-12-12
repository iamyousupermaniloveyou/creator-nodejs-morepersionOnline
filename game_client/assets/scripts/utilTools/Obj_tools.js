function result(callfunc,pama){
    if(callfunc){
        callfunc(pama)
    }
}
function createPrefeb(prefeb_path,callfunc){
    cc.loader.loadRes(prefeb_path,function(errorMsg,loaderRes){
        if(errorMsg){ 
            console.log("载入预制体资源失败，原因:" + errorMsg)
            result(callfunc,null)
            return
        }
        if(!(loaderRes instanceof cc.Prefab)){
            console.log("出入的不是预制体资源")
            result(callfunc,null)
            return
        }
        var prefab = cc.instantiate(loaderRes)
        result(callfunc,prefab)
    }) 
}

function showLoadingTips(_des){ 
    if(!_des,Object)
    this.createPrefeb("loading_tip",function(prefab){
        if(!prefab){
            console.log("创建预制体失败！！！")
            return
        }
        this.removeLoadingTips() 
        var des = prefab.getChildByName("des").getComponent(cc.Label)
        cc.director.getScene().addChild(prefab,1000)
    }.bind(this))
}

function removeLoadingTips(){
    var curscene  = cc.director.getScene()
    if(curscene){
        var LoadingTips =  curscene.getChildByName("loading_tip")
        if(LoadingTips){
            LoadingTips.removeFromParent()
        }
    }
}

function showNoticeTips(_title,_des){ 
    this.createPrefeb("notice_tips",function(prefab){
        if(!prefab){
            console.log("创建预制体失败！！！")
            return
        }
        var title = prefab.getChildByName("title").getComponent(cc.Label)
        var des = prefab.getChildByName("des").getComponent(cc.Label)
        if(title){
            title.string = _title.toString()
        }
        if(des){
            des.string = _des.toString()
        }
        cc.director.getScene().addChild(prefab,100)
    }.bind(this))
}

module.exports = {
    createPrefeb:createPrefeb,
    showLoadingTips:showLoadingTips,
    removeLoadingTips:removeLoadingTips,
    showNoticeTips:showNoticeTips,

}