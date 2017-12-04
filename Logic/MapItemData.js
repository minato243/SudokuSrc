/**
 * Created by thaod on 12/3/2017.
 */

var MapItemData = cc.Class.extend({
    level: 0,
    status: LOCK,
    numStar: 0,

    ctor: function(level){
        this.level = level;
        this.status = LOCK;
        this.numStar = 0;
    },

    ctor: function(level, status, numStar){
        this.level = level;
        this.status = status;
        this.numStar = numStar;

        cc.log(this.toString());
    },

    open: function() {
        this.status = UN_LOCK;
    },

    setNumStar: function(numStar){
        this.numStar = numStar;
    },

    toString: function(){
        var result = "MapItemData{level = "+ this.level+", status = "+this.status +", numStar = "+ this.numStar+"}";
        return result;
    }

});