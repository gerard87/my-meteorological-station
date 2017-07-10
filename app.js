var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var init_values = require('./js/init_values');
var sockets = require('./js/sockets');
var lg = require('./js/lg-communication');
var env = process.env.NODE_ENV || 'development';
var firebase = require('./js/firebase');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){

    firebase.readStations(res, env);

});


app.post('/sensors', function(req, res){

    sockets.update_sensor_values(io, req.body);

    firebase.writeStationSensors(req.body);

    res.json(req.body);
});


app.post('/api', function(req, res){

    sockets.update_api_values(io, req.body);

    firebase.writeStationAPI(req.body);

    res.json(req.body);
});


app.post('/lg', function (req, res){

    if (req.body.stop === 'true') {
        lg.exit_tour();
        lg.clean_lg();
    } else {
        var sensors_array = [req.body.temperature, req.body.humidity, req.body.temperature2,
            req.body.pressure, req.body.sealevel_pressure, req.body.altitude];
        var coords = [req.body.longitude, req.body.latitude];

        lg.show_kml_balloon(req.body.city, coords, sensors_array);
    }
    res.end();

});


http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});