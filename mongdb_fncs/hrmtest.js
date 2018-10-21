db.loadServerScripts()
defineFunc("hrm_createEmployee",function(data){
  if(data._id){
    	return  query("hrm.eployeees")
    	.where("_id=={0}",data._id)
    	.set(data)
    	.commit();
  }
  else {
    	return  query("hrm.eployeees").insert(data).commit();
  }
  
 
});
var item=query(db.getCollection("hrm.eployeees")).findOne();
item.lastName="Chung";

hrm_createEmployee(item)