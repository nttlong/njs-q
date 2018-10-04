/**
 * Xem link 
 * https://community.jaspersoft.com/documentation/jasperreports-server-web-services-guide/v56/running-report
 * 
 * @param {*} options 
 * @param {*} callback 
 */
function publicReport(
    options,
    callback){
    if(!options.label){
        callback(new Error("Miss label value in options"));
    }
    if(!options.dataSourcePath){
        callback(new Error("dataSourcePath value in options was not found"));
    }
    if(!options.reportServerUrl){
        callback(new Error("reportServerUrl value in options was not found\r\nExample:\r\n"+
            "http://localhost:8080/jasperserver/rest_v2/resources/public"));
    }
    if(!options.fileName){
        callback(new Error("fileName value in options was not found"));
    }
    var request = require("request"),
    fs = require("fs"),
    reportUnitDescriptor = {
        "label": options.label,
        "description": options.description||"No description",
        "alwaysPromptControls": "true",
        "controlsLayout": "popupScreen",
        "dataSource": {
            "dataSourceReference": {
                "uri": options.dataSourcePath
            }
        },
        "jrxml": {
            "jrxmlFile": {
                "label": options.label,
                "type": "jrxml"
            }
        }   
    };
    try {
        request.post({
            url: options.reportServerUrl,
            auth: { user:options.user, password: options.password}, //user: "jasperadmin", password: "jasperadmin" 
            formData: {
                resource: {
                value: JSON.stringify(reportUnitDescriptor),
                options: {
                    contentType: "application/repository.reportUnit+json"
                }
                },
                jrxml: fs.createReadStream(options.fileName),
            }
        }, function(err, response, body) {
            console.log("status: " + response.statusCode + "; message: " + response.statusMessage);
        });
    } catch (error) {
        callback(error);
    }
}
module.exports={
    publicReport:publicReport,
    jasper:function(url,username,pasword){
        var Jasper=require("./core");
        return new Jasper(url,username,pasword);
    }
}