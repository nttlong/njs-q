var x=require("./index").jasper(
    "http://172.16.7.67:8080/jasperserver",
    "jasperadmin",
    "jasperadmin"
    );
try {
    var lst=x.reports.run("danhsachnhanvien","html");    
    console.log(lst);
} catch (error) {
    console.error(error);
}


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