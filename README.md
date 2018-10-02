# njs-q
1- Create your app:

    Example:
    
        var q = require("quicky");
        var dbConnection = "..."; //uri connect to mongodb
        q.mongo.connect(dbConnection);
        q.language.setConfig(cnn,"sys_language");
        var app = q.apps;
        app.setSecretKey("sas03udh74327%$63283");
        app.setCacheMode(true);
        app.setCompressMode(false);
        app.sessionCacheUseMemCache(true);
        app.load(
            {
                name:"test", //name of micro application
                hostDir:"", //host dir for micro application 
                dir:"apps/test" // relative path to micro application
            }
        ).listen(4000,function(){
            console.log("app start  at port 4000");
        });
 
 
 2- In root directory of project create folder "views" and leave all file or sub folder view here with html extension:
 
    Example:
        
          |--    index.html
          |--    systems
                |-- index.html
                |-- users.html
                |-- users$userId.html
                
     
     The Expressjs route will automaticaly generate according to each file in "views" or its sub folders.
     
     Example: 
        - The file index.html in views will generate route "/" with content handle is a content of index.html.
        
        - The systems/users.html will generate route "/system/users".
        
        - The systems/index.html will generate routr "/systems"
      
 3- Parameterize a route handler according to file name:
 
        The "$" in html view filename will translate into ":" in Expressjs. For below example users$userId.html will generate route like this:
        "systems/users:userId"
 4 - Server code script tags:
 
        In content of html view place:
        
            <script server>
                (function(
                    model, //model will be render
                    req, // expression request
                    res, // expression response
                    next, // next handler
                ){
                    return {
                        load:function(){
                            //hanlde on page load for the both get and post method
                        },
                        post:function(data){
                            // handle on client submit data, just use for post method
                        }
                    }
                });
            </script>             
 5- Django template rendering:
 ===============================
        
        This project use Django template syntax: see
        
        https://mozilla.github.io/nunjucks/
 6- Built-in model function use in Django template:
 ==========================
 
    1- getRes(key,value): sync with mongodb language resource and get value of view in app.
     
    2- getAppRes(key,value): sync with mongodb language resource and get value of app.
    
    3- getGlobalRes(key,value): sync with mongodb language resource and get value of global.
    
    4- getAppStatic(fileName): write to client a url of static resource in app.
    
    5- getAbsUrl(): get full url of web host.
    
    6- getAppUrl(): get app url.
    
    