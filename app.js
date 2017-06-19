var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');

var sensors_array = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
    res.render('index',{
        title: 'My Meteorological Station'
    })
});

app.post('/sensors', function(req, res){
    // console.log(req.body);
    io.sockets.emit('temperature', req.body.temperature);
    io.sockets.emit('humidity', req.body.humidity);
    io.sockets.emit('temperature2', req.body.temperature2);
    io.sockets.emit('pressure', req.body.pressure);
    io.sockets.emit('sealevel_pressure', req.body.sealevel_pressure);
    io.sockets.emit('altitude', req.body.altitude);

    sensors_array = [req.body.temperature, req.body.humidity, req.body.temperature2,
        req.body.pressure, req.body.sealevel_pressure, req.body.altitude];

    res.json(req.body);
});

app.post('/api', function(req, res){
    // console.log(req.body);
    io.sockets.emit('city', req.body.city);
    io.sockets.emit('weather', req.body.weather);
    io.sockets.emit('wind_dir', req.body.wind_dir);
    io.sockets.emit('wind_kph', req.body.wind_kph);
    io.sockets.emit('dewpoint_c', req.body.dewpoint_c);
    io.sockets.emit('heat_index_c', req.body.heat_index_c);
    io.sockets.emit('windchill_c', req.body.windchill_c);
    io.sockets.emit('feelslike_c', req.body.feelslike_c);
    io.sockets.emit('visibility_km', req.body.visibility_km);
    io.sockets.emit('precip_today_metric', req.body.precip_today_metric);
    io.sockets.emit('icon', req.body.icon);
    io.sockets.emit('icon_url', req.body.icon_url);

    res.json(req.body);
});

app.post('/lg', function (req, res){

    var options = {
        mode: 'text',
        args: [req.body.city, sensors_array]
    };

    PythonShell.run('./scripts/lg-scripts/lgComm.py', options, function (err, results) {
        if(err)console.log(err);
        console.log(results);
    });
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});