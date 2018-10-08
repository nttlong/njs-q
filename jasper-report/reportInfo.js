// reportUnitDescriptor = {
//     "label": options.label,
//     "description": options.description||"No description",
//     "alwaysPromptControls": "true",
//     "controlsLayout": "popupScreen",
//     "dataSource": {
//         "dataSourceReference": {
//             "uri": options.dataSourcePath
//         }
//     },
//     "jrxml": {
//         "jrxmlFile": {
//             "label": options.label,
//             "type": "jrxml"
//         }
//     }   
// }
function JrxmlFileInfo(){
     this.label="";
     this.type="jrxml";   
}
function JrxmlInfo (){
    this.jrxmlFile=new JrxmlFileInfo();
}
function DataSourceReference(){
    this.uri=""
}

function ReportInfo(){
    this.label="new Report";
    this.description="";
    this.alwaysPromptControls=false;
    this.controlsLayout="popupScreen";
    this.dataSourcePath="";
    this.fileName="";
    this.uri="reports";
}
module.exports={
    create:function(){
        return new ReportInfo()
    },
    ReportInfo:ReportInfo
}