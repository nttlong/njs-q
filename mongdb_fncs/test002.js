db.loadServerScripts()
query(db.getCollection("hrm.employees"))
//.match("$exists(_depId)")
//.items()

//.project({
//  x:"$exists(_depId)"
//}
//)
//.items()
//.pipeline
.group({
  _id:"xx",
  TongSoCoBoPhan:"$sum($exists(_depId))",
  TongSoChuaGanBoPHan:"$sum($iif(_depId!=null,0,1))",
  TongSo:"$sum(1)"
  
})
.items()
.pipeline
//.match("$type(created_on,'date')")
////.pipeline
//.addFields({
//  mydate3:"$dateFromString('2017-02-08T12:10:40.787')"
//})
//.project({
//  created_on:"$dateToString($created_on,'%Y-%m-%d')",
//  mydate1:"$dateFromString('2017-02-08T12:10:40.787')",
//  mydate:"$type(mydate)",
//  mydate3:1
//})
//.pipeline
//.count()
.items()
.items()
.match("$in(code,{0})",[/nv00110/i])
.createView("views.test003.emps")
//.out("test001.employees").items()
//.set({
//  	_depId:query(db.getCollection("hrm.departments")).where("code=='hrm'").item()._id
//}).commit()
.items()
.count()
query("hrm.departments").items()

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