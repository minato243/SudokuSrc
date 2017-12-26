/**
 * Created by thaod on 12/27/2017.
 */

var MessageDialog = BasePopupDialog.extend({
    callBackFunc: null,
    acceptCallBack: null,

    acceptButton: null,
    cancelButton: null,
    acceptLabel: null,
    cancelLabel: null,

    messageLabel: null,
    titleLabel: null,

    ctor: function(){
        this._super();
        var layer = ccs.load(res.MessageDialog);
        this.addChild(layer.node);
        var bgImage = layer.node.getChildByName("bgImage");
        var bgTitle = bgImage.getChildByName("bg_title");

        this.titleLabel = bgTitle.getChildByName("lb_title");
        this.messageLabel = bgImage.getChildByName("lb_message");

        this.acceptButton = bgImage.getChildByName("btn_accept");
        this.acceptButton.addTouchEventListener(this.onAcceptClick, this);
        this.cancelButton = bgImage.getChildByName("btn_cancel");
        this.cancelButton.addTouchEventListener(this.onCancelClick, this);

        this.acceptLabel = this.acceptButton.getChildByName("lb_accept");
        this.cancelLabel = this.cancelButton.getChildByName("lb_cancel");
    },

    startDialog: function(acceptCallBack, callBackFunc, title, message){
        this.setAcceptCallBack(acceptCallBack);
        this.setCallBackFunc(callBackFunc);

        this.titleLabel.setString(title);
        this.messageLabel.setString(message);

        if(this.getParent() != null) return;

        ScreenMgr.getInstance().currentScreen.addChild(this, LAYER_DIALOG);
    },

    _removeFromParent: function(){
        if(this.callBackFunc != null){
            this.callBackFunc.execute();
            this.callBackFunc.release();
        }
        this._super();
    },

    setAcceptLabel: function(acceptStr){
        this.acceptLabel.setString(acceptStr);
    },

    setCancelLabel: function(cancelStr){
        this.cancelLabel.setString(cancelStr);
    },

    setCallBackFunc: function(callBackFunc){
        this.callBackFunc = callBackFunc;
        if(this.callBackFunc != null) this.callBackFunc.retain();
    },

    setAcceptCallBack: function(acceptCallBack){
        this.acceptCallBack = acceptCallBack;
        if(this.acceptCallBack != null) this.acceptCallBack.retain();
    },

    onAcceptClick: function(sender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            SoundManager.playClickSound();

            if(this.acceptCallBack != null){
                this.acceptCallBack.execute();
                this.acceptCallBack.release();
            }
            this.closeDialog();
        }
    },

    onCancelClick: function(sender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            SoundManager.playClickSound();
            this.closeDialog();
        }
    }

});

MessageDialog.instance = null;

MessageDialog.getInstance = function(){
    if(MessageDialog.instance == null){
      MessageDialog.instance = new MessageDialog();
      MessageDialog.instance.retain();
    }
    return MessageDialog.instance;
};