/**
 * Created by thaod on 5/3/2017.
 */
/**
 * Created by thaod on 5/1/2017.
 */


var BasePopupDialog = cc.Layer.extend({

    onEnter: function(){
        cc.log("BasePopupDialog.onEnter");
        this._super();
        var action = cc.Sequence([cc.ScaleTo(0, 0.5), cc.ScaleTo(0.2, 1.2), cc.ScaleTo(0.2, 1)]);
        this.runAction(action);
    },

    onExit: function(){
        cc.log("BasePopupDialog.onExit");
        this._super();
    },

    closeDialog: function(){
        cc.log("BasePopupDialog.closeDialog");
        var action = cc.Sequence(cc.ScaleTo(0.2, 1.2), cc.ScaleTo(0.3, 0.5), cc.CallFunc(this._removeFromParent, this));
        this.runAction(action);
    },

    _removeFromParent: function(){
        this.stopAllActions();
        this.removeFromParent(true);
        //ScreenMgr.getInstance().currentScreen.removeChild(this);
    },

});

BasePopupDialog.dialogInstance = null;
BasePopupDialog.getInstance = function(){
    if(BasePopupDialog.dialogInstance == null){
        BasePopupDialog.dialogInstance = new BasePopupDialog();
        BasePopupDialog.dialogInstance.retain();
    }
    return BasePopupDialog.dialogInstance;
}


