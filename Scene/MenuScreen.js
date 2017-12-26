var MenuScreenLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var mainScreen = ccs.load(res.MainScene_json);
        this.addChild(mainScreen.node);

        var playButton = mainScreen.node.getChildByName("btn_play");
        playButton.addTouchEventListener(this.startGame, this);

        this.volumeButton = mainScreen.node.getChildByName("btn_volume");
        this.volumeButton.addTouchEventListener(this.onClickVolumeButton, this);

        this.shareButton = mainScreen.node.getChildByName("btn_share");
        this.shareButton.addTouchEventListener(this.onClickShareButton, this);

        this.highScoreButton = mainScreen.node.getChildByName("btn_high_score");
        this.highScoreButton.addTouchEventListener(this.onClickHighScoreButton, this);

        this.achievementButton = mainScreen.node.getChildByName("btn_achievement");
        this.achievementButton.addTouchEventListener(this.onClickAchievementButton, this);

        this.settingButton = mainScreen.node.getChildByName("btn_setting");
        this.settingButton.addTouchEventListener(this.onClickSettingButton, this);
        this.settingButton.setVisible(false);

        this.bgImage = mainScreen.node.getChildByName("bgImage");

        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                cc.log("keyCode = "+keyCode);
                if(keyCode == cc.KEY.backspace || keyCode == cc.KEY.back){
                    MenuScreenLayer.getInstance().onBackPress();
                }else if(keyCode == cc.KEY.home){
                    //do something
                }
            }
        });
        cc.eventManager.addListener(keyboardListener, this.bgImage);

        return true;
    },


    startGame: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            SoundManager.playClickSound();
            ScreenMgr.getInstance().changeScreen(MAP_SCREEN);
        }
    },

    onClickVolumeButton: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            cc.log("onClickVolumeButton");
            var soundMgr = SoundManager.getInstance();
            if(soundMgr.status == SOUND_ON) soundMgr.setMusicOff();
            else soundMgr.setMusicOn();
            SoundManager.playClickSound();

            this.updateButtonVolume();
        }
        
    },

    onClickShareButton: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            //todo
            SoundManager.playClickSound();
            cc.warn("onClickShareButton");
        }
    },

    onClickHighScoreButton: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            //todo
            SoundManager.playClickSound();
            cc.error("onClickHighScoreButton");
        }
    },
    onClickSettingButton: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            //todo
            SoundManager.playClickSound();
            cc.log("onClickSettingButton");
        }
    },
    onClickAchievementButton: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            //todo
            SoundManager.playClickSound();
            cc.log("onClickAchievementButton");
        }
    },

    updateButtonVolume: function(){
        if(SoundManager.getInstance().status == SOUND_OFF){
            this.volumeButton.loadTextureNormal("btn_volume_off_2", ccui.Widget.PLIST_TEXTURE);
            this.volumeButton.loadTexturePressed("btn_volume_on_2", ccui.Widget.PLIST_TEXTURE);
        } else {
            this.volumeButton.loadTextureNormal("btn_volume_off", ccui.Widget.PLIST_TEXTURE);
            this.volumeButton.loadTexturePressed("btn_volume_on", ccui.Widget.PLIST_TEXTURE);
        }
    },

    onBackPress: function(){
        this.acceptCallBack = cc.callFunc(this.doBackPress, this);
        MessageDialog.getInstance().startDialog(this.acceptCallBack, null, "Exit Game", "Are you sure want to exit game?");
        MessageDialog.getInstance().setAcceptLabel("Exit");
    },

    doBackPress: function(){
        cc.director.end();
    }

});

MenuScreenLayer.instance = null;
MenuScreenLayer.getInstance = function(){
    if(MenuScreenLayer.instance == null){
        MenuScreenLayer.instance = new MenuScreenLayer();
        MenuScreenLayer.instance.retain();
    }

    return MenuScreenLayer.instance;
};

var MenuScreen = cc.Scene.extend({
    layer: null,

    onEnter:function () {
        this._super();
        this.layer = MenuScreenLayer.getInstance();
        if(this.layer.getParent() == null )this.addChild(this.layer);
    }
});

MenuScreen
