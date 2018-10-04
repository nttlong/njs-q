var x=require("./index").jasper(
    "http://172.16.7.67:8080/jasperserver",
    "jasperadmin",
    "jasperadmin"
    );
var lst=x.roles.find();
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