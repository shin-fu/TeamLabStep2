var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/OnlineSkillUp');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var Schema = mongoose.Schema;
var todoSchema = new Schema({
    isCheck : {type:Boolean,default:false},
    text : String,
    createdDate :{type:Date,default:Date.now},
    limitDate : Date,
    root : String
});
var listSchema = new Schema({
    text:String
})
mongoose.model('Todo',todoSchema);
mongoose.model('List',listSchema);

app.get('/list',function(req,res){
    var List = mongoose.model('List');
    var name=req.query.name;
    var id = req.query._id;
    if(name){
        List.findOne({text:name},function(err,lists){
            res.send(lists);
        });
    }else if(id){
        List.find({_id:id},function(err,lists){
            res.send(lists);
        });
    }else{
       List.find({},function(err,lists){
            res.send(lists);
        }); 
    }
});

app.post('/list',function(req,res){
    var name = req.body.name;
        if(name){
            var List = mongoose.model('List');
            var list = new List();
            list.text = name;
            list.save();
            res.send(true);
        }else{
            res.send(false);
        }
});

app.get('/todo',function(req,res){
    var Todo = mongoose.model('Todo');
    var root=req.query.root;
    var name=req.query.name;
    var _id = req.query._id;
    var checked = req.query.checked;

    if(root){
        Todo.find({root:root},function(err,todos){
            res.send(todos);
        });
    }else if(name){
        Todo.findOne({text:name},function(err,todos){
            res.send(todos);
        });
    }else{
        Todo.find({},function(err,todos){
            res.send(todos);
        });
    }
});

app.post('/todo',function(req,res){
    var name = req.body.name;
    var limit = req.body.limit;
    var root = req.body.root;
    var _id = req.body._id;
    var checked=req.body.checked;
    var Todo = mongoose.model('Todo');
    if(_id){
        console.log(_id);
        Todo.update({_id:_id},{$set:{isCheck:true}},function(err){
            console.log(err);
        });
        Todo.findOne({_id:_id},function(err,res){
            console.log(res);
        });
        res.send(true);
    }else if(name && limit && root){
        var todo = new Todo();
        todo.text = name;
        todo.limitDate = limit;
        todo.root = root;
        todo.save();
        res.send(true);
    }else{
        res.send(false);
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});






module.exports = app;
