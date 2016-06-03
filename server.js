var express = require('express');
var bodyParser = require('body-parser');
var _ = require ('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());


app.get('/', function(req, res){
    res.send('Todo API Root');
});

//app.get('/todos', function(req, res){
//    res.json(todos);
//});


// GET /todos/:id

app.get('/todos/:id', function (req,res){
    var todoId = parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(todos,{id:todoId});

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }

});


// GET /todos?completed=true&q=dog

app.get('/todos', function (req,res){
    var queryParams = req.query;
    var filteredTodos = todos;

    //debugger;
    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(todos, {"completed" : true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(todos, {"completed" : false});
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0 ) {
        filteredTodos = _.filter(filteredTodos, function (todo) {
            return todo.description.toLocaleLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }

    res.json(filteredTodos);


});


// POST /todos

app.post('/todos',function(req, res){
    var body = _.pick(req.body,'description','completed');


    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(400).send();
    }

    body.description = body.description.trim();
    // add id field
    body.id = todoNextId++;

    // push body into array
    todos.push(body);

    res.json(body);
});

// DELETE /todos/:id

app.delete('/todos/:id', function (req,res){
    var todoId = parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(todos,{id:todoId});

    if (matchedTodo) {
        todos = _.without(todos,matchedTodo);
        res.json(matchedTodo);
    } else {
        res.status(404).json({"error" : "no todo found with that id"});
    }
});


// PUT /todos

app.put('/todos/:id',function(req, res){
    var todoId = parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(todos,{id:todoId});
    var body = _.pick(req.body,'description','completed');
    var validAttributs = {};

    if(!matchedTodo){
        return res.status(404).send();
    }

    // validate completed attribute
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributs.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    // validate description attribute
    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributs.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(matchedTodo,validAttributs);
    res.json(matchedTodo);

});




app.listen(PORT , function(){
    console.log("Express server started  at port... " + PORT);
});