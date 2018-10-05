var x=require("./index").jasper(
    "http://172.16.7.67:8080/jasperserver",
    "jasperadmin",
    "jasperadmin"
    );
try {
    var lst=x.repository.search({
        type:"reportUnit"
    });
    var y=lst;
    // var lst=x.reports.run("Danh_sach_nhan_vien","html");    
    // var fs=require("fs");
    // fs.writeFileSync("test001.html",lst,"binary");
    // sconsole.log(lst);
    // var r=x.repository.search({
    //      q:"danh"
    // });
} catch (error) {
    console.error(error);
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