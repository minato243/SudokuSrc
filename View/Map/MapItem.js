/**
 * Created by thaod on 12/3/2017.
 */

var MapItem = cc.Class.extend({
    TAG:"MapItem ",
    button: null,
    lockSprite: null,
    starList:[],
    levelLabel: null,
    data: null,

    ctor: function(){
      this._super();
    },

    ctor: function(item, data){
        this.button = item;
        this.data = data;

        this.button.setScale9Enabled(false);
        this.lockSprite = this.button.getChildByName("img_log");
        this.starList = [];
        for (var i = 0; i < 3; i ++){
            var starSprite = this.button.getChildByName("ic_star_"+ (i+1).toString());
            this.starList.push(starSprite);
        }
        this.levelLabel = this.button.getChildByName("lb_level");

        this.button.addTouchEventListener(this.onButtonClick, this);
        //Utility.getInstance().setScaleWhenTouch(this.button);
    },

    initData: function(){
        this.levelLabel.setString(this.data.level.toString());
        this.lockSprite.setVisible(this.data.status == LOCK);
        var backgroundSprite = this.getBackgroundSpriteNameFromData();
        var pressBackgroundSprite = this.getBackgroundSpriteNameFromData();
        this.button.loadTextureNormal(backgroundSprite, ccui.Widget.PLIST_TEXTURE);
        this.button.loadTexturePressed(pressBackgroundSprite, ccui.Widget.PLIST_TEXTURE);
        this.showNumStar();
    },

    createBackgroundSpriteFromData: function(){
        if(this.data.status == LOCK){
            return cc.Sprite.create("#ic_log_item.png");
        } else {
            if(this.data.numStar == 0) return cc.Sprite.create("#ic_ready.png");
            else return cc.Sprite.create("#ic_finished_item.png");
        }
    },

    getBackgroundSpriteNameFromData: function(){
        if(this.data.status == LOCK){
            return "ic_log_item.png";
        } else {
            if(this.data.numStar == 0) return "ic_ready.png";
            else return "ic_finished_item.png";
        }
    },

    showNumStar: function(){
        for (var i = 0; i < this.data.numStar; i ++){
            this.starList[i].setVisible(true);
        }

        for (i = this.data.numStar; i < 3; i ++){
            this.starList[i].setVisible(false);
        }
    },

    onButtonClick: function(sender, controlEvent){
        Utility.setScaleWhenTouchButton(sender, controlEvent);

        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            cc.log(this.TAG + "onButtonClick");
            
            if(this.data.status == UN_LOCK) this.startGame();
            else this.showLockNotify();
        }
    },

    startGame: function(){
        ScreenMgr.getInstance().changeScreen(PLAY_SCREEN);
        var playScreen = ScreenMgr.getInstance().currentScreen;
        playScreen.startNewGame(this.data.level);
    },

    showLockNotify: function(){
        //todo
    },

    setData: function(data)
    {
        this.data = data;
        this.initData();
    }


});