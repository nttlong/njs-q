function MissingFields(message,fields){
    Error.call(message);
    this.fields=fields;
    this.code="missingFields";
}
module.exports={
    MissingFields:MissingFields
}