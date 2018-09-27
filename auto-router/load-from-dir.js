const fs = require('fs');
const path =require('path');
var express = require('express');
function loadFromDir(dir){
    var ret=[];
    var lst=fs.readdirSync(dir);
    for(var i=0;i<lst.length;i++){
        var item=lst[i];
        var isFolder=false;
        try {
            isFolder= fs.lstatSync(path.join(dir,item)).isDirectory()
        } catch (error) {
            
        }
        if (isFolder){
            var _lst=loadFromDir(path.join(dir,item));
            for(var j=0;j<_lst.length;j++){
                ret.push({
                   url: lst[i]+"/"+(_lst[j].url==="/"?"":_lst[j].url),
                   file:_lst[j].file 
                });
            }
        }
        else {
            if(item==="index.html"){
                ret.push({
                    url:"/",
                    file:path.join(dir,item)
                });
            }
            else if (item.substring(item.length-5,item.length)===".html") {
                ret.push({
                    url:item.substring(0,item.length-5),
                    file:path.join(dir,item)
                });
            }
            
        }
    }
    return ret;
}
function createRoute(hostDir,dir){
    var urls=loadFromDir(path.join(dir,"views"));
    var ret=[];
    for(var i=0;i<urls.length;i++){
        var _url=((urls[i].url==="/")?"":urls[i].url);
        if(hostDir && hostDir!=""){
            _url="/"+hostDir+"/"+_url;
        }
        else {
            _url="/"+_url;
        }
        ret.push({
            url:_url,
            file:urls[i].file
        });
    }
    return ret;
}
module.exports=createRoute;