var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var storage = require('node-persist');
var init_values = require('./public/js/init_values');
var sockets = require('./public/js/sockets');
var lg = require('./public/js/lg-communication');
var env = process.env.NODE_ENV || 'development';

var coords = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
storage.initSync();

app.get('/', function(req, res){

    var stations = storage.getItemSync('stations');

    var sensors_data = [];
    if (stations !== undefined) {
        var station;
        for (station in stations) {
            if (stations.hasOwnProperty(station))
                sensors_data.push(storage.getItemSync('sensorsData'+stations[station]));
        }

    }

    var api_data = storage.getItemSync('apiData');

    if (api_data === undefined) {
        api_data = init_values.api_init_values;
    } else {
        coords = [api_data['longitude'], api_data['latitude']];
    }

    res.render('index',{
        title: 'My Meteorological Station',
        api_data: api_data,
        sensors_data: sensors_data,
        env: env
    });
});

app.post('/sensors', function(req, res){

    sockets.update_sensor_values(io, req.body);

    storage.setItemSync('sensorsData'+req.body.name, req.body);

    var stations = storage.getItemSync('stations');
    if (stations === undefined) {
        storage.setItemSync('stations', [req.body.name]);
    } else {
        if (!isStationRegistered(req.body.name, stations)) {
            stations.push(req.body.name);
            storage.setItemSync('stations', stations);
        }
    }

    res.json(req.body);
});

function isStationRegistered (name, stations) {
    var station;
    for (station in stations) {
        if (stations.hasOwnProperty(station) &&
            stations[station] === name) return true
    }
    return false;
}

app.post('/api', function(req, res){

    sockets.update_api_values(io, req.body);

    coords = [req.body.longitude, req.body.latitude];

    storage.setItemSync('apiData', req.body);

    res.json(req.body);
});

app.post('/lg', function (req, res){

    if (req.body.stop === 'true') {
        lg.exit_tour();
        lg.clean_lg();
    } else {
        var sensors_array = [req.body.temperature, req.body.humidity, req.body.temperature2,
            req.body.pressure, req.body.sealevel_pressure, req.body.altitude];
        lg.show_kml_balloon(req.body.city, coords, sensors_array);
    }
    res.end();

});


http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});