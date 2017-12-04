/**
 * Created by thaod on 5/1/2017.
 */


var GameOverDialog = BasePopupDialog.extend({
    starList: [],
    titleLabel: null,
    timeLabel: null,
    errorLabel: null,
    scoreLabel: null,
    coinLabel: null,
    menuButton: null,
    newGameButton: null,

    isWon: false,

   ctor: function(){
       this._super();
       var layer = ccs.load(res.GameOverDialog);
       this.addChild(layer.node);
       var bgImage = layer.node.getChildByName("bgImage");
       var bgDialog = bgImage.getChildByName("bgDialog");
       var bgTitle = bgDialog.getChildByName("bg_game_over_title");
       this.titleLabel = bgTitle.getChildByName("lb_title");
       this.starList = [];
       for (var i = 0; i < 3; i ++){
           var starImg = bgTitle.getChildByName("img_star_"+(i+1));
           this.starList.push(starImg);
       }

       this.menuButton = bgDialog.getChildByName("btn_menu");
       this.menuButton.addTouchEventListener(this.onMenuClick, this);
       this.newGameButton = bgDialog.getChildByName("btn_new_game");
       this.newGameButton.addTouchEventListener(this.onNewGameClick, this);

       cc.eventManager.addListener({
           event: cc.EventListener.TOUCH_ONE_BY_ONE,
           swallowTouches: true,
           onTouchBegan: function(touch, event){
               return true;
           },

           onTouchMoved: function(touch, event){

           },
           onTouchEnded: function(touch, evnt){
                var a = 1;
           }
       }, this);


   },

    initData: function(){

    },

    //onEnter: function(){
    //    cc.log("onEnter");
    //    this._super();
    //    var action = cc.Sequence([cc.ScaleTo(0, 0.5), cc.ScaleTo(0.2, 1.2), cc.ScaleTo(0.2, 1)]);
    //    this.runAction(action);
    //},
    //
    //onExit: function(){
    //    cc.log("onExit");
    //    this._super();
    //},
    //
    //closeDialog: function(){
    //    cc.log("closeDialog");
    //    var action = cc.Sequence(cc.ScaleTo(0.2, 1.2), cc.ScaleTo(0.3, 0.5), cc.CallFunc(this._removeFromParent, this));
    //    this.runAction(action);
    //},
    //
    //_removeFromParent: function(){
    //    this.stopAllActions();
    //    ScreenMgr.getInstance().currentScreen.removeChild(this);
    //},

    onMenuClick: function(sender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            this.closeDialog();
            this.backToMenu();
        }

    },

    onNewGameClick: function(sender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            this.closeDialog();
            this.startNewGame();
        }
    },

    startNewGame: function(){
        var playScreen = ScreenMgr.getInstance().currentScreen;
        playScreen.restart();
    },

    backToMenu: function(){
        ScreenMgr.getInstance().changeScreen(MENU_SCREEN);
    }


});

GameOverDialog.dialogInstance = null;
GameOverDialog.getInstance = function(){
    if(GameOverDialog.dialogInstance == null){
        GameOverDialog.dialogInstance = new GameOverDialog();
        GameOverDialog.dialogInstance.retain();
    }
    return GameOverDialog.dialogInstance;
}


GameOverDialog.startDialog = function(win){
    //todo
    GameOverDialog.getInstance();
    GameOverDialog.dialogInstance.isWon = win;
    GameOverDialog.dialogInstance.initData();
    if(GameOverDialog.dialogInstance.getParent() != null) return;
    var otherLayers = ScreenMgr.getInstance().currentScreen.getChildren();


    ScreenMgr.getInstance().currentScreen.addChild(GameOverDialog.dialogInstance, LAYER_DIALOG);
}
