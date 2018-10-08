var x=require("./index").jasper(
    "http://172.16.7.67:8080/jasperserver",
    "jasperadmin",
    "jasperadmin"
    );
var q=require("./index");
try {
    // var info=q.createReportInfo();
    // info.uri="reports/Danh_sach_nhan_vien3"
    // info.dataSourcePath="/datasources/lms2";
    // info.fileName="/home/hcsadmin/source/nodejs/quicky/jasper-report/Exp_DanhSachNhanVien.jrxml";
    // info.label="long_test_001";
    // var r=x.resource.publishReport(info);
    // var r=x.resource.getInfo("reports/Danh_sach_nhan_vien")
    var f=q.filter.create();
    f.setType(q.filter.resourceTypes.customDataSource);
    var r=x.resource.search(f);
    console.log(r);
    // var f=require("./index").filter.create();
    // // f.setSearch("XXX");
    // f.setType(q.filter.resourceTypes.query);
    // var lst=x.resource.search();
    // var info=q.createFolderInfo();
    // info.uri="test001/test002/test003";
    // info.description="Long thực hiện test";
    // info.label="Thử  Report"
    // var lst=x.resource.createFolder(info);
    // console.log(lst);
    // console.log(f.toString())
    // var lst=x.repository.search({
    //     type:"reportUnit"
    // });
    // var y=lst;
    // var lst=x.reports.run("Danh_sach_nhan_vien","html");    
    // var fs=require("fs");
    // fs.writeFileSync("test001.html",lst,"binary");
    // sconsole.log(lst);
    // var r=x.repository.search({
    //      q:"danh"
    // });
} catch (error) {
    console.error(error.message);
}
//var r=x.reports.findRunning("danhsachnhanvien");
// var fs=require("fs");
// fs.writeFileSync("test.html",r,"utf-8");
// console.log(r)

// try {
//     var ret=x.users.createOrModify({
//         username:"nttlong",
//         password:"123456",
//         fullName:"Nguyen Tran The Long",
//         emailAddress:"nttlong@lacviet.com.vn",
//         roles:[{name:"ROLE_ADMINISTRATOR"}]
//     });
//     console.log(ret);
// } catch (error) {
//     console.error(error);
// }