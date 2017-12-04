var Utility = cc.Class.extend({

    ctor: function(){

    },

});

Utility.timeToString = function(time){
    var date = new Date(time*1000);
    // Hours part from the timestamp
    var hours = date.getUTCHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    if(hours =="0") var formattedTime = minutes.substr(-2) + ':' + seconds.substr(-2);
    else var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
};