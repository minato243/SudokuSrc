/** Created by thaod on 1/8/2018.*/

var PlatformUtils = cc.Class.extend({
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
