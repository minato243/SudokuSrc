/**
 * Created by thaod on 12/7/2017.
 */
var KEY_GOLD = "gold";
var KEY_LEVEL = "level";
var KEY_MAP_ITEM_LIST = "map_item_list";

var COMPLETE_SCORE = 100;
var TIME_EXPECT = 300;
var SCORE_PER_ERROR = 10;
var SCORE_PER_GOLD = 10;

var GameDataMgr = cc.Class.extend({
    gold: 50,
    currentLevel: 1,
    mapItemDataList:[],

    ctor: function(){
        this.loadData();
        //this.createFirstData();
        //this.saveData();
    },

    loadData: function(){
        this.gold = GameDataMgr.getCache(KEY_GOLD, 0);
        if(this.gold == undefined || typeof(this.gold) != "number") this.gold = 0;
        this.currentLevel = GameDataMgr.getCache(KEY_LEVEL, 1);
        if(this.currentLevel == undefined) this.currentLevel = 1;

        var mapItemDataListStr = GameDataMgr.getCache(KEY_MAP_ITEM_LIST, "");
        if(mapItemDataListStr == ""){
            this.createFirstData();
            this.saveData();
        } else {
            var mapItemStringArray = mapItemDataListStr.split("_");
            this.mapItemDataList = [];
            for (var i = 0; i < mapItemStringArray.length; i++){
                var mapItemStr = mapItemStringArray[i];
                cc.log("mapItemStr = "+mapItemStr);
                var mapItemData = MapItemData.createFromString(mapItemStr);
                if(mapItemData != null)this.mapItemDataList.push(mapItemData);
            }

            for (var i = 0 ;i < this.mapItemDataList.length; i++){
                cc.log(this.mapItemDataList[i].toString());
            }
        }

        cc.log(GameDataMgr.TAG + "loadData[gold = "+ this.gold+", level = "+ this.currentLevel+", mapItemDataList = "+ this.mapItemDataList);
    },

    saveData: function(){
        GameDataMgr.saveCache(KEY_GOLD, this.gold);
        GameDataMgr.saveCache(KEY_LEVEL, this.currentLevel);

        var mapItemListStr = this.mapItemDataList[0].convertToStorageString();
        for (var i = 1; i < this.mapItemDataList.length; i ++){
            mapItemListStr = mapItemListStr+"_"+this.mapItemDataList[i].convertToStorageString();
        }
        GameDataMgr.saveCache(KEY_MAP_ITEM_LIST, mapItemListStr);
        //cc.log(GameDataMgr.TAG + "saveData[gold = "+ this.gold+", level = "+ this.currentLevel+", mapItemDataList = "+ this.mapItemDataList);
    },

    createFirstData: function(){
        this.mapItemDataList = [];
        this.mapItemDataList.push(new MapItemData(1, UN_LOCK, 0 ));
        for (var i = 1; i < NUM_TOTAL_LEVEL; i ++){
            var itemData = new MapItemData(i+1, LOCK, 0);
            this.mapItemDataList.push(itemData);
        }
    },

    getMapItemDataList: function(){
        return this.mapItemDataList;
    },

    updateMapItemData: function(level, time, error){
        var score = GameDataMgr.convertFromTimeToScore(time);
        score = score - GameDataMgr.convertFromErrorToScore(error);
        var star = GameDataMgr.convertFromScoreToStar(score);
        cc.log("updateMapItemData" + level.toString());
        if(star > this.mapItemDataList[level -1].numStar){
            this.mapItemDataList[level -1].numStar = star;
            if(level < this.mapItemDataList.length) this.mapItemDataList[level].status = UN_LOCK;
        }
        var bonusGold = GameDataMgr.convertFromScoreToGold(score);
        this.gold += bonusGold;
        if(this.currentLevel == level) this.currentLevel = level +1;
        this.saveData();
    },

    addGold: function(numGold){
        this.gold += numGold;
        if(this.gold < 0) this.gold = 0;
        GameDataMgr.saveCache(KEY_GOLD, this.gold);
    },

    canUseGold: function(numGold){
        return this.gold + numGold >0;
    }

});

GameDataMgr.instance = null;
GameDataMgr.TAG = "GameDataMgr ";
GameDataMgr.getInstance = function(){
    if(GameDataMgr.instance == null){
        GameDataMgr.instance = new GameDataMgr();
    }
    return GameDataMgr.instance;
};

GameDataMgr.saveCache = function(key, value){
    var jsonKey = JSON.stringify(key);
    var jsonValue = JSON.stringify(value);
    cc.sys.localStorage.setItem(jsonKey, jsonValue);
    cc.log(GameDataMgr.TAG+"saveCache[key = "+ key+",value = "+value+ "]");
};

GameDataMgr.getCache = function(key, defaultValue){
    var jsonKey = JSON.stringify(key);
    var jsonValue = cc.sys.localStorage.getItem(jsonKey);
    cc.log("jsonValue = " + jsonValue);
    if(jsonValue == null || jsonValue == undefined) return defaultValue;
    var value = JSON.parse(jsonValue);
    cc.log(GameDataMgr.TAG+"getCache[key = "+ key+",value = "+value+ "]");
    return value;
};

GameDataMgr.convertFromLevelToDifficult = function(level){
    var difficult = Math.floor((level-1) / NUM_LEVEL_ONE_MAP);

    if(difficult == 0) return LEVEL_EASY;
    if(difficult == 1) return LEVEL_MEDIUM;
    if(difficult == 2) return LEVEL_HARD;
    if(difficult == 3) return LEVEL_VERY_HARD;

};

GameDataMgr.getScore = function(second, numError){
    var timeScore = GameDataMgr.convertFromTimeToScore(second);
    var errorScore = GameDataMgr.convertFromErrorToScore(numError);
    var score = timeScore - errorScore;

    return score;
};

GameDataMgr.convertFromTimeToScore = function(second){
    var score = TIME_EXPECT - second;
    if(score <0) score = 0;
    score = score + COMPLETE_SCORE ;

    return score;
};

GameDataMgr.convertFromErrorToScore = function(numError){
    var score = numError * (numError +1);
    return score * SCORE_PER_ERROR;
};

GameDataMgr.convertFromScoreToGold = function(score){
    return Math.floor(score / SCORE_PER_GOLD);
};

GameDataMgr.convertFromScoreToStar = function(score){
    var maxScore = TIME_EXPECT + COMPLETE_SCORE;
    if(score > maxScore /2) return 3;
    if(score > maxScore /4) return 2;
    if(score >0) return 1;
    return 0;
};
