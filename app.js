var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');
var storage = require('node-persist');
var env = process.env.NODE_ENV || 'development';

var sensors_array = [];
var coords = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
storage.initSync();

app.get('/', function(req, res){

    var api_data = storage.getItemSync('apiData');
    var sensors_data = storage.getItemSync('sensorsData');

    if (api_data === undefined) {
        api_data = api_init_values();
    } else {
        coords = [api_data['longitude'], api_data['latitude']];
    }

    if (sensors_data === undefined) {
        sensors_data = sensors_init_values();
    } else {
        sensors_array = [sensors_data['temperature'], sensors_data['humidity'], sensors_data['temperature2'],
            sensors_data['pressure'], sensors_data['sealevel_pressure'], sensors_data['altitude']];
    }

    res.render('index',{
        title: 'My Meteorological Station',
        api_data: api_data,
        sensors_data: sensors_data,
        env: env
    });
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

    storage.setItemSync('sensorsData', req.body);

    res.json(req.body);
});

app.post('/api', function(req, res){
    // console.log(req.body);
    io.sockets.emit('city', req.body.city);
    io.sockets.emit('weather', req.body.weather);
    io.sockets.emit('wind_dir', req.body.wind_dir);
    io.sockets.emit('wind_kph', req.body.wind_kph + ' kph');
    io.sockets.emit('dewpoint_c', req.body.dewpoint_c + ' *C');
    io.sockets.emit('heat_index_c', req.body.heat_index_c + ' *C');
    io.sockets.emit('windchill_c', req.body.windchill_c + ' *C');
    io.sockets.emit('feelslike_c', req.body.feelslike_c + ' *C');
    io.sockets.emit('visibility_km', req.body.visibility_km + ' km');
    io.sockets.emit('precip_today_metric', req.body.precip_today_metric + ' mm');
    io.sockets.emit('icon', req.body.icon);
    io.sockets.emit('icon_url', req.body.icon_url);

    coords = [req.body.longitude, req.body.latitude];

    storage.setItemSync('apiData', req.body);

    res.json(req.body);
});

app.post('/lg', function (req, res){

    var options = {
        mode: 'text',
        args: [req.body.city, coords, sensors_array]
    };

    PythonShell.run('./scripts/lg-scripts/lgComm.py', options, function (err, results) {
        if(err)console.log(err);
        console.log(results);
    });
});

function api_init_values () {
    return {
        'city': '',
        'weather': '',
        'wind_dir': '',
        'wind_kph': '0',
        'dewpoint_c': '0',
        'heat_index_c': '0',
        'windchill_c': '0',
        'feelslike_c': '0',
        'visibility_km': '0',
        'precip_today_metric': '0',
        'icon': '',
        'icon_url': ''
    }
}

function sensors_init_values () {
    return {
        'temperature': '0 *C',
        'humidity': '0 %',
        'temperature2': '0 *C',
        'pressure': '0 Pa',
        'sealevel_pressure': '0 Pa',
        'altitude': '0 m'
    }
}

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});