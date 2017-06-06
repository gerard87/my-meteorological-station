var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
    res.render('index',{
        title: 'Home'
    })
});

app.post('/', function(req, res){
    console.log(req.body);
    io.sockets.emit('temperature', req.body.temperature);
    io.sockets.emit('humidity', req.body.humidity);
    io.sockets.emit('temperature2', req.body.temperature2);
    io.sockets.emit('pressure', req.body.pressure);
    io.sockets.emit('sealevel_pressure', req.body.sealevel_pressure);
    io.sockets.emit('altitude', req.body.altitude);
    res.json(req.body);
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});