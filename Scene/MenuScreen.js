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
        return true;
    },


    startGame: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            if(controlEvent == ccui.Widget.TOUCH_ENDED){
                ScreenMgr.getInstance().changeScreen(MAP_SCREEN);
                ScreenMgr.getInstance().currentScreen.restart();
            }
        }
    },

    onClickVolumeButton: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            //todo
            cc.log("onClickVolumeButton");
        }
        
    },

    onClickShareButton: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            //todo
            cc.warn("onClickShareButton");
        }
    },

    onClickHighScoreButton: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
        //todo
        cc.error("onClickHighScoreButton");
        }
    },
    onClickSettingButton: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
        //todo
        cc.log("onClickSettingButton");
        }
    },
    onClickAchievementButton: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
        //todo
        cc.log("onClickAchievementButton");
        }
    }

});


var MenuScreen = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuScreenLayer();
        this.addChild(layer);
    }
});
