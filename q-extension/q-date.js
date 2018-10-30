/**
 * get UTC now
 */
Date.prototype.toUCT=function(time){
    var now = time
    return  Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
}
Date.prototype.getUTCNow=function(){
    var now = new Date;
    return  new Date(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
} 
