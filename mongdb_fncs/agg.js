function create(name){
    this.name=name;
}
create.prototype.select=function(){
    console.log(arguments)
}