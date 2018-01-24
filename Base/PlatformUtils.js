/** Created by thaod on 1/8/2018.*/

var PlatformUtils = cc.Class.extend({

    signInGoogle: function(){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT, "signIn","()V");
    },

    shareMyApp: function(){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT,"shareMyApp","()V");
    },

    showHighScore: function(){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT, "showRanking","()V");
    },

    updateScore: function(score){
        this.callAndroidFunction(PlatformUtils.CLASS_DEFAULT, "updateHighScore", "(I)V", score);
    },

    callAndroidFunction: function(className, methodName, methodSignature, parameters){
        var returnValue;
        if(parameters == undefined) returnValue = jsb.reflection.callStaticMethod(className, methodName,methodSignature);
        else returnValue = jsb.reflection.callStaticMethod(className, methodName,methodSignature, parameters);
        cc.log("PlatformUtils.callAndroidFunction "+ returnValue);
    }
});

PlatformUtils.instance = null;

PlatformUtils.getInstance = function(){
    if(PlatformUtils.instance == null){
        PlatformUtils.instance = new PlatformUtils();
    }

    return PlatformUtils.instance;
};

PlatformUtils.destroyInstance = function(){
    if(PlatformUtils.instance!= null){
        PlatformUtils.instance.release();
    }
};

PlatformUtils.CLASS_DEFAULT = "com.biggame.sudoku.AndroidUtils";
