/**
 * Created by thaod on 12/3/2017.
 */

var MapLayer = cc.Layer.extend({
    bgImage: null,
    nextMapButton: null,
    previousMapButton: null,
    itemList: [],

    currentMap:0,

    ctor: function()
    {
        //////////////////////////////
        // 1. super init first
        this._super();

        var mapScreen = ccs.load(res.MapScene_json);
        this.addChild(mapScreen.node);

        this.bgImage = mapScreen.node.getChildByName("bgImage");

        this.nextMapButton = mapScreen.node.getChildByName("btn_next");
        this.nextMapButton.addTouchEventListener(this.onClickNextMapButton, this);

        this.previousMapButton = mapScreen.node.getChildByName("btn_previous");
        this.previousMapButton.addTouchEventListener(this.onClickPreviousMapButton, this);

        this.initMapItem();

        return true;
    },

    initMapItem: function(){
        this.itemList = [];
        for (var i = 0; i < NUM_MAP_ONE_LEVEL; i ++){
            var button = this.bgImage.getChildByName("btn_item_"+  (i+1).toString());
            var itemData = new MapItemData(i+1);
            cc.log(itemData.toString());
            var mapItem = new MapItem(button, itemData);
            mapItem.initData();

            this.itemList.push(mapItem);
        }
    },


    updateData: function(){
        //todo
    },

    onClickNextMapButton: function(){
        //todo
    },

    onClickPreviousMapButton: function(){
        //todo
    },


});

var MapScene = cc.Scene.extend({

    ctor: function()
    {
        this._super();
        var layer = new MapLayer();
        this.addChild(layer);
    },

    onEnter: function(){
        this._super();
    }

});

MapScene.instance = null;
MapScene.getInstance = function()
{
    if(MapScene.instance == null)
    {
        MapScene.instance = new MapScene();
        MapScene.instance.retain();
    }
    return MapScene.instance;
}

