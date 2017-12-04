var SIZE_OF_CELL = 46;
var PlayLayer = cc.Layer.extend({
    sprite: null,
    board: null,
    labelList: null,
    tempLabelList: null,
    posX: [],
    posY: [],
    selectedCellSprite: [],
    changeModeButton: null,
    eraserButton: null,
    hintButton: null,
    buttonList: [],
    isInsertMode: true, //
    timeLabel: null,
    coinLabel: null,
    errorLabel: null,
    levelLabel: null,
    bgImage: null,

    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
       // var cache = cc.spriteFrameCache;
        //cc.SpriteFrameCache.addSpriteFramesWithFile("playScene.plist");

        var size = cc.winSize;

        var playScreen = ccs.load(res.PlayScene_json);
        this.addChild(playScreen.node);
        var bgImage = playScreen.node.getChildByName("bgImage");
        this.bgImage = bgImage;
        this.labelList = [];
        this.buttonList = [];
        this.tempLabelList = [];
        for (var i = 0; i < SIZE; i++) {
            cc.log("ctor function " + i.toString());
            this.labelList.push([]);
            var btn = this.bgImage.getChildByName("btn_" + (i + 1).toString());
            btn.setTag(i);
            btn.addTouchEventListener(this.onButtonClick, this);
            this.buttonList.push(btn);
        }
        this.board = new Board(LEVEL_EASY);
        this.posX = [49, 95, 141, 190, 237, 284, 331, 377, 425];
        this.posY = [292, 338, 385, 433, 481, 525, 573, 618, 660];
        this.selectedCellSprite = [];

        this.hintButton = this.bgImage.getChildByName("btn_hint");
        this.hintButton.addTouchEventListener(this.onClickHintButton, this);
        this.eraserButton = this.bgImage.getChildByName("btn_eraser");
        this.eraserButton.addTouchEventListener(this.onClickEraserButton, this);
        this.changeModeButton = this.bgImage.getChildByName("btn_change_mode");
        this.changeModeButton.addTouchEventListener(this.onClickChangeModeButton, this);

        this.timeLabel = bgImage.getChildByName("lb_time");
        this.errorLabel = bgImage.getChildByName("lb_error");
        this.levelLabel = bgImage.getChildByName("lb_level");
        this.coinLabel = bgImage.getChildByName("lb_num_coin");

        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchEnded: function (touch, event) {
                cc.log("onTouchEnded");
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    cc.log("sprite began ..x = " + locationInNode.x + ". y = " + locationInNode.y);
                    var i = 0;
                    PlayLayer.getInstance().onBoardClick(locationInNode.x, locationInNode.y);
                    return true;
                }
                return false;
            }
        });

        cc.eventManager.addListener(touchListener, bgImage);

        return true;
    },

    drawBoard: function () {
        var matrix = this.board.getUserMatrix();
        var oMatrix = this.board.getMatrix();
        for (var i = 0; i < SIZE; i++) {
            for (var j = 0; j < SIZE; j++) {
                if (this.labelList[i][j] == undefined) {
                    this.labelList[i][j] = new cc.LabelTTF("", "Arial", 36);
                    this.addChild(this.labelList[i][j], 10);
                }
                this.labelList[i][j].setString(matrix[i][j].toString());
                this.setPositionForLabel(this.labelList[i][j], i, j);
                if (matrix[i][j] == 0) this.labelList[i][j].setVisible(false);
                else {
                    this.labelList[i][j].setVisible(true);
                    if (matrix[i][j] == oMatrix[i][j]) this.labelList[i][j].setColor(BLACK);
                    else this.labelList[i][j].setColor(BROWN);
                }
            }
        }
        this.drawSelected();
        this.drawError();
        this.drawTempMatrix();
    },

    drawSelected: function () {
        var selectedPoint = this.board.getSelect();
        if (selectedPoint != null) {
            var matrix = this.board.getUserMatrix();
            if (matrix[selectedPoint.y][selectedPoint.x] != 0) {
                var idx = 0;
                for (var i = 0; i < SIZE; i++) {
                    for (var j = 0; j < SIZE; j++) {
                        if (matrix[i][j] == matrix[selectedPoint.y][selectedPoint.x]) {
                            if (this.selectedCellSprite[idx] == undefined) {
                                this.selectedCellSprite[idx] = cc.Sprite.createWithSpriteFrameName("chon.png");
                                this.bgImage.addChild(this.selectedCellSprite[idx], 2);
                            }
                            this.selectedCellSprite[idx].setPosition(cc.p(this.posX[j], this.posY[i]));
                            this.selectedCellSprite[idx].setVisible(true);
                            idx++;
                        }
                    }
                }

                for (i = idx; i < SIZE + SIZE; i++) {
                    if (this.selectedCellSprite[i] != undefined) {
                        this.selectedCellSprite[i].setVisible(false);
                    }
                }
                return;
            }
            for (i = 0; i < SIZE; i++) {
                if (this.selectedCellSprite[i] == undefined) {
                    this.selectedCellSprite[i] = cc.Sprite.create("#chon.png");;
                    this.bgImage.addChild(this.selectedCellSprite[i], 2);
                }
                this.selectedCellSprite[i].setPosition(cc.p(this.posX[i], this.posY[selectedPoint.y]));
                this.selectedCellSprite[i].setVisible(true);
            }

            for (j = 0; j < SIZE; j++) {
                if (this.selectedCellSprite[SIZE + j] == undefined) {
                    this.selectedCellSprite[SIZE + j] = cc.Sprite.create("#chon.png");
                    this.bgImage.addChild(this.selectedCellSprite[SIZE + j]);
                }
                this.selectedCellSprite[SIZE + j].setPosition(cc.p(this.posX[selectedPoint.x], this.posY[j]));
                this.selectedCellSprite[SIZE + j].setVisible(true);
            }

        } else {
            for (i = 0; i < SIZE; i++) {
                if (this.selectedCellSprite[i] != undefined) {
                    this.selectedCellSprite[i].setVisible(false);
                }
            }

            for (j = 0; j < SIZE; j++) {
                if (this.selectedCellSprite[SIZE + j] != undefined) {
                    this.selectedCellSprite[SIZE + j].setVisible(false);
                }
            }
        }
    },

    removeTempLabel: function () {
        var n = this.tempLabelList.length;
        for (var i = n - 1; i >= 0; i--) {
            this.tempLabelList[i].removeFromParent();
            this.tempLabelList[i] = null;
        }
        this.tempLabelList = [];
    },

    drawTempMatrix: function () {
        this.removeTempLabel();
        var tempMatrix = this.board.tempMatrix;
        for (var i = 0; i < SIZE; i++) {
            for (var j = 0; j < SIZE; j++) {
                var n = tempMatrix[i][j].length;
                for (var k = 0; k < n; k++) {
                    this.addTempLabelToScene(tempMatrix[i][j][k], i, j);
                }
            }
        }
    },

    drawError: function () {
        var errorPoint = this.board.getError();
        if (errorPoint == null) return;
        var i = errorPoint.x;
        var j = errorPoint.y;

        this.labelList[i][j].setColor(cc.RED);
    },


    addTempLabelToScene: function (val, i, j) {
        var w = 45;
        var h = 45;

        var label = new cc.LabelTTF("", "Arial", 18);
        var x = ((val - 1) % 3 - 1) * w / 3 + this.posX[j];
        var y = (Math.floor((val - 1) / 3) - 1) * h / 3 + this.posY[i];
        label.x = x;
        label.y = y;
        label.setString(val.toString());
        if (this.board.isExistInUserMatrix(i, j, val) != null) label.setColor(cc.RED);
        else label.setColor(BLACK);
        this.addChild(label, 10);
        this.tempLabelList.push(label);
    },

    onBoardClick: function (x, y) {
        var touchPoint = this.convertFromPixelToPoint(x, y);
        cc.log("onBoardClick: " + touchPoint.x + "," + touchPoint.y);
        this.board.setSelect(touchPoint);
        cc.log("board select (" + this.board.getSelect().x + ", " + this.board.getSelect().y + ")");
        this.updateBoard();
    },

    onButtonClick: function (sender, controlEvent) {
        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            cc.log("onButtonClick");
            var tag = sender.getTag();
            if (this.isInsertMode) {
                var r = this.board.insertIntoUserMatrix(this.board.getSelect().y, this.board.getSelect().x, tag + 1);
                if (r == 0) {
                    SoundManager.playTrueMusic();
                    if(this.board.isFull()) this.youWin();
                } else if (r == -1) {
                    SoundManager.playFalseMusic();
                    var numError = this.board.numError;
                    this.showNumError(numError);
                    if (numError >= MAX_ERROR_IN_GAME) this.gameOver();
                } else {
                    SoundManager.playTrueMusic();
                    if(this.board.isFull()) this.youWin();
                }
            }

            else this.board.insertIntoTempMatrix(this.board.getSelect().y, this.board.getSelect().x, tag + 1);
            this.updateBoard();
        }
    },

    onClickHintButton: function (sender, controlEvent) {
        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            cc.log("onClickHintButton");
            this.board.hint();
            this.updateBoard();
        }
    },

    onClickEraserButton: function (sender, controlEvent) {
        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            cc.log("onClickEraserButton");
            this.board.eraser();
            this.updateBoard();
        }
    },

    onClickChangeModeButton: function (sender, controlEvent) {
        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            cc.log("onClickChangeModeButton");
            this.isInsertMode = !this.isInsertMode;
            if (this.isInsertMode) {
                this.changeModeButton.loadTextureNormal("res/playScense/btn_off.png", ccui.Widget.LOCAL_TEXTURE);
                this.changeModeButton.loadTexturePressed("res/playScense/btn_on.png", ccui.Widget.LOCAL_TEXTURE);

            } else {
                this.changeModeButton.loadTextureNormal("res/playScense/btn_on.png", ccui.Widget.LOCAL_TEXTURE);
                this.changeModeButton.loadTexturePressed("res/playScense/btn_off.png", ccui.Widget.LOCAL_TEXTURE);
            }
        }
    },

    convertFromPixelToPoint: function (x, y) {
        var touchPoint = new Point();
        for (var i = 0; i < SIZE; i++) {
            if (x > this.posX[i] - SIZE_OF_CELL / 2) continue;
            else break;
        }
        if (i < SIZE) touchPoint.x = i - 1;
        else if (x < this.posX[SIZE - 1] + SIZE_OF_CELL / 2) touchPoint.x = SIZE - 1;
        else touchPoint.x = -1;

        for (i = 0; i < SIZE; i++) {
            if (y > this.posY[i] - SIZE_OF_CELL / 2) continue;
            else break;
        }
        if (i < SIZE) touchPoint.y = i - 1;
        else if (y < this.posY[SIZE - 1] + SIZE_OF_CELL / 2) touchPoint.y = SIZE - 1;
        else touchPoint.y = -1;
        return touchPoint;
    },

    setPositionForLabel: function (label, i, j) {
        label.x = this.posX[j];
        label.y = this.posY[i];
    },

    updateBoard: function () {
        this.drawBoard();
    },

    showNumError: function (numError) {
        var str = "";
        for (var i = 0; i < numError; i++) {
            str += "x";
        }
        this.errorLabel.setString(str);
    },

    gameOver: function () {
        GameOverDialog.startDialog(false);
    },

    youWin: function() {
        GameOverDialog.startDialog(true);
    },

    restart: function()
    {
        this.board = new Board(LEVEL_EASY);
        this.drawBoard();
        this.showNumError();
    }


});

PlayLayer.instance = null;

PlayLayer.getInstance = function(){
    if(PlayLayer.instance == null){
        PlayLayer.instance = new PlayLayer();
        PlayLayer.instance.retain();
    }
    return PlayLayer.instance;
};


var PlayScene = cc.Scene.extend({
    time: 0,
    layer: null,

    ctor: function(){
        this._super();
        this.time = 0;

        this.layer = PlayLayer.getInstance();
        this.layer.drawBoard();
        this.layer.showNumError();
        this.addChild(this.layer);
    },
    
    onEnter:function () {
        this._super();
        this.schedule(this.updateTime, 0.5);
    },

    updateTime: function(delta){
        this.time += delta;
        var t = Math.floor(this.time);
        var str =  Utility.timeToString(t);
        this.layer.timeLabel.setString(str);
    },

    restart: function(){
        this.layer.restart();
        this.resetTime();
    },

    resetTime: function(){
        this.time = 0;
        var timeStr = Utility.timeToString(this.time);
        this.layer.timeLabel.setString(timeStr);
    }
});

PlayScene.instance = null;
PlayScene.getInstance = function(){
    if(PlayScene.instance == null){
        PlayScene.instance = new PlayScene();
        PlayScene.instance.retain();
    }
    return PlayScene.instance;
}