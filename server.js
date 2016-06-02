var express = require('express');
var app = express();

var PORT = 4000;

//var PORT = process.env.PORT || 4000;
//
//var middleware = require('./middleware.js');
//
//app.use(middleware.logger);
//
//app.get('/about', middleware.requireAuthentication, function(req,res){
//    res.send('About Us');
//});
//
//app.use(express.static(__dirname+ '/public'));
//
//app.listen(PORT, function(){
//    console.log('Express server started on port ' + PORT + '!');
//});


var middleware = {
    requireAuthentication: function(req, res, next){
        console.log('private route hit !');
        next();
    },
    logger: function (req, res, next){
        console.log('Request : ' + new Date().toString() + ' ' + req.method + ' ' + req.originalUrl);
        next;
    }
};

//app.use(middleware.requireAuthentication);

app.use(middleware.logger);

app.get('/about',middleware.requireAuthentication, function(req,res){
    res.send("About US !!");
});

app.use(express.static(__dirname + "/public"));

app.listen(PORT , function(){
    console.log("Express server started  at port... " + PORT);
});