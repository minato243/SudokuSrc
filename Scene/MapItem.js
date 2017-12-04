/**
 * Created by thaod on 12/3/2017.
 */

var MapItem = cc.Class.extend({
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

        this.lockSprite = this.button.getChildByName("img_log");
        this.starList = [];
        for (var i = 0; i < 3; i ++){
            var starSprite = this.button.getChildByName("ic_star_"+ (i+1).toString());
            this.starList.push(starSprite);
        }
        this.levelLabel = this.button.getChildByName("lb_level");
    },

    initData: function(){
        cc.log(this.data.toString());
        this.levelLabel.setString(this.data.level.toString());
        this.lockSprite.setVisible(this.data.status == LOCK);
        var backgroundSprite = this.createBackgroundSpriteFromData();
        this.button.setBackgroundSprite(backgroundSprite, cc.CONTROL_STATE_NORMAL);
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

    showNumStar: function(){
        for (var i = 0; i < this.data.numStar; i ++){
            this.starList[i].setVisible(true);
        }

        for (var i = this.data.numStar; i < 3; i ++){
            this.starList[i].setVisible(false);
        }
    }


});