var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

//var middleware = require('./middleware.js');
//app.use(middleware.logger);
//
//app.get('/about',middleware.requireAuthentication, function(req,res){
//    res.send("About US !!");
//});
//
//app.use(express.static(__dirname + "/public"));


app.use(bodyParser.json());


app.get('/', function(req, res){
    res.send('Todo API Root');
});

app.get('/todos', function(req, res){
    res.json(todos);
});


// GET /todos/:id

app.get('/todos/:id', function (req,res){
    var todoId = parseInt(req.params.id,10);
    var matchedTodo;

    todos.forEach(function(todo){
        if (todoId === todo.id) {
            matchedTodo = todo;
        }
    });

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }

});

// POST /todos

app.post('/todos',function(req, res){
    var body = req.body;
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});



app.listen(PORT , function(){
    console.log("Express server started  at port... " + PORT);
});