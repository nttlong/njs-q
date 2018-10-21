db.loadServerScripts()
query(db.getCollection("hrm.employees")).where("$in(code,{0})",[/nv0011/i]).count()
query("hrm.departments")
.rightJoin(db.getCollection("hrm.employees"),"code","parentCode","deps")
.items()
//.insert({
//code:"acc",
//name:"Phòng kế toán",
//parentCode:"tct"
//},{
//  code:"hrm",
//name:"Phòng nhân sự",
//parentCode:"tct"
//}).commit()

query("hrm.employees").where("code=={0}","nv001")